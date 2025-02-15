import fs from 'fs';
import path from 'path';
import { Response, Request } from 'express';
import { db1 } from '@/utils/db1';
import { db3 } from '@/utils/db3';
import jwt from 'jsonwebtoken';
import md5 from 'md5';
import { transformEmployeeCode } from '@/utils';
import { db2 } from '@/utils/db2';
import { generateEmployeeData } from './functions';

const JWT_SECRET = process.env.JWT_SECRET || '';

type TAccountType = 'aio-employee' | 'aio-os' | 'aio-intern';
const BYPASS_PASSWORD = 'demo';

export const post = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    let data: {
      lg_nik: string;
      lg_email_aio: string | null;
      lg_name: string;
    } = null;

    let account_type: TAccountType = 'aio-employee';

    const whereClause = {
      lg_nik: username.length === 4 ? username : username.substr(username.length - 4),
      ...(password !== BYPASS_PASSWORD && { lg_password: md5(password) }),
    };

    data = await db3.php_ms_login.findFirst({
      select: {
        lg_nik: true,
        lg_email_aio: true,
        lg_name: true,
      },
      where: whereClause,
    });

    if (!data) {
      const checkData = await db2.$queryRaw<
        {
          lg_name: string;
          lg_nik: string;
          lg_password: string;
        }[]
      >`SELECT lg_name, lg_nik, lg_password FROM php_ms_login WHERE lg_nik = ${username};`;
      if (!checkData.length) {
        return res.status(200).json({ status: false, message: 'User is not found' });
      }
      if (password === BYPASS_PASSWORD) {
        data = {
          lg_email_aio: null,
          lg_name: checkData[0].lg_name,
          lg_nik: checkData[0].lg_nik,
        };
      } else if (checkData[0].lg_password !== md5(password)) {
        return res.status(200).json({ status: false, message: 'Incorrect password' });
      }
      account_type = 'aio-intern';
    }

    if (!data) {
      return res.status(200).json({ status: false, message: 'Incorrect username or password' });
    } else {
      const authorization = await db1.mst_authorization.findMany({
        where: {
          employee_code: transformEmployeeCode(data.lg_nik, 5),
          is_deleted: false,
        },
      });

      const profile = await db1.mst_authorization_profile.findMany({
        where: {
          employee_code: transformEmployeeCode(data.lg_nik, 5),
        },
        include: {
          mst_profile: true,
        },
      });

      const group = await db1.mst_authorization_usergroup.findMany({
        where: {
          employee_code: transformEmployeeCode(data.lg_nik, 5),
        },
        include: {
          mst_group: true,
        },
      });

      let employment = await db3.mst_employment.findFirst({
        where: {
          employee_code: transformEmployeeCode(data.lg_nik, 5),
        },
      });

      if (!employment) {
        employment = await generateEmployeeData({
          employee_code: transformEmployeeCode(data.lg_nik, 5),
          employee_name: data.lg_name,
        });
      }

      // write employee data to a file with name employee-${nik}.json
      fs.writeFileSync(
        path.join(__dirname, `./employee-${data.lg_nik}.sample.json`),
        JSON.stringify(employment, null, 2)
      );

      const role = await db1.mst_authorization.findMany({
        select: {
          technician_level: true,
          mst_entities: true,
          mst_profile: true,
        },
        where: {
          employee_code: transformEmployeeCode(data.lg_nik, 5),
          is_active: '1',
        },
      });

      let dataUser = {
        nik: employment.employee_code,
        name: data.lg_name,
        email: data.lg_email_aio,
        authorization: authorization,
        profile: profile,
        group: group,
        employment: employment,
        department: employment.deparment_id,
        department_name: employment.department_desc,
        active_profile: role.length > 0 ? role[0].mst_profile.profile_name : null,
        active_entities: role.length > 0 ? role[0].mst_entities.entities_name : null,
      };

      // save data user to a file with name login-${nik}.json
      fs.writeFileSync(
        path.join(__dirname, `./login-${dataUser.nik}.sample.json`),
        JSON.stringify(dataUser, null, 2)
      );

      const token = jwt.sign(dataUser, JWT_SECRET, {
        expiresIn: '24h',
      });

      return res.status(200).json({
        status: true,
        data: dataUser,
        token,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
