import fs from 'fs';
import path from 'path';
import { emailSender } from './EmailService';
import {
  encryptRequestValidation,
  fillParameters,
  newLineToBr,
  transformEmployeeCode,
} from '@/utils';
import { db1 } from '@/utils/db1';
import moment from 'moment';
import { db2 } from '@/utils/db2';
import { db3 } from '@/utils/db3';

interface Recipient {
  email: string;
}

interface Files {
  email: string;
}

interface Config {
  recipients: {
    email: string;
  };
  files: Files;
  title: string;
}

interface ConfigParam {
  sendEmail?: boolean;
  recipients?: {
    email: string;
  };
  files?: Files;
  title?: string;
}

const generateConfig = async (type: string, param: any): Promise<Config> => {
  let files: Files = { email: '' };
  let target_user: Recipient[] = [];
  let recipients = { email: '' };
  let title = '';

  if (type === 'StartProject') {
    title = 'Project Task Calculation';
    recipients.email = param['email'];
    files.email = 'bodyEmailNotifStartProject.html';
  } else {
    throw new Error('Notification type not found!');
  }

  return { recipients, files, title };
};

export const sendEmailNotification = async (
  type: string,
  param: any,
  configParam: ConfigParam = {}
): Promise<boolean> => {
  const sendEmail = configParam.sendEmail !== undefined ? configParam.sendEmail : true;
  let recipients = configParam.recipients || { email: '' };
  let files = configParam.files || { email: '' };
  let title = configParam.title || '';

  const emailFolderPath = './src/views/email/';
  let bodyEmail = '';

  let config: Config;

  if (param && recipients && files && title) {
    config = {
      recipients,
      files,
      title,
    };
  } else {
    config = await generateConfig(type, param);
  }

  const emailFilePath = `${emailFolderPath}${config.files.email}`;

  try {
    bodyEmail = fs.readFileSync(emailFilePath, 'utf8');
  } catch (err) {
    throw new Error(err as string);
  }

  bodyEmail = fillParameters(bodyEmail, param);

  if (sendEmail) {
    await emailSender({
      subject: config.title,
      to: config.recipients.email,
      cc: '',
      text: 'Please enable HTML!',
      body: bodyEmail,
      attachments: [],
    });
  }

  return true;
};

export const getRequestValidationDetail = async (params: {
  requestId: number;
  /** 5 digit of employee_code */
  validator: string;
}) => {
  const requestData = await db1.tr_request.findFirst({
    where: {
      id: params.requestId,
    },
  });

  if (!requestData) {
    throw new Error('Request not found');
  }

  const templateParams = {
    validatorName: '',
    creatorName: '',
    ticket_name: requestData.ticket_name,
    type: requestData.type,
    creation_date: moment(requestData.creation_date).format('DD MMMM YYYY'),
    department_name: requestData.department_name,
    background: newLineToBr(requestData.background),
    background_what: newLineToBr(requestData.background_what),
    background_who: newLineToBr(requestData.background_who),
    background_when: newLineToBr(requestData.background_when),
    background_where: newLineToBr(requestData.background_where),
    background_why: newLineToBr(requestData.background_why),
    background_how: newLineToBr(requestData.background_how),
    issue_description: newLineToBr(requestData.issue_description),
    business_impact: newLineToBr(requestData.business_impact),
  };

  const employeeData = await db1.$queryRaw<
    readonly [{ employee_name: string; employee_code: string; mail_id: string }]
  >`SELECT 
    b.employee_name,
    b.employee_code,
    b.mail_id
  FROM 
    aio_employee.mst_employment b 
  WHERE b.employee_code IN (${transformEmployeeCode(requestData.creator)}, ${transformEmployeeCode(
    params.validator
  )})
  `;

  const creatorDataEmployee = employeeData.find(
    (data) => data.employee_code === requestData.creator
  );

  const creatorName = creatorDataEmployee?.employee_name || '';

  const validatorDataEmployee = employeeData.find(
    (data) => data.employee_code === params.validator
  );

  const validatorName = validatorDataEmployee?.employee_name || '';

  templateParams.creatorName = creatorName;
  templateParams.validatorName = validatorName;

  return templateParams;
};

export const sendEmailRequestValidation = async (params: {
  requestId: number;
  /** 5 digit of employee_code */
  validator: string;
}) => {
  const encrypted = encryptRequestValidation(params.requestId, params.validator);

  const validation_link = `${process.env.FE_URL}/request-validation?value=${encrypted}`;

  const templateParams = await getRequestValidationDetail(params);

  const template = fs.readFileSync(
    path.resolve(__dirname, '../views/email/bodyEmailRequestValidation.html'),
    'utf8'
  );

  const html = fillParameters(template, { ...templateParams, validation_link });

  const validatorNik = await db3.mst_employment.findFirst({
    where: {
      employee_code: transformEmployeeCode(params.validator, 5),
    },
    select: {
      mail_id: true,
      employee_name: true,
      employee_code: true,
    },
  });

  const to = process.env.MODE === 'production' ? validatorNik?.mail_id : 'enurlustiawan@aio.co.id';

  await emailSender({
    subject: 'Request Validation',
    to,
    text: 'Please enable HTML!',
    body: html,
    attachments: [],
    cc: '',
  });

  return true;
};
