import { Request } from 'express';

export interface DecodedAuthorization {
  nik: string;
  name: string;
  email: string;
  authorization: IAuthorization[];
  profile: IProfile[];
  group: any[];
  employment: IEmployment;
  department: number;
  department_name: string;
  active_profile: string;
  active_entities: string;
  iat: number;
  exp: number;
}

interface IEmployment {
  id: number;
  deparment_id: number;
  grade_id: number;
  is_active: number;
  is_presdir: number;
  is_bod: number;
  is_depthead: number;
  created_at: Date;
  created_by: string;
  master_ou_code: number;
  employee_code: string;
  employee_name: string;
  address_line_1: string;
  address_line_2: string;
  mail_id: string;
  employment_ou: number;
  employment_ou_desc: string;
  supervisor: string;
  supervisor_name: string;
  position_code: string;
  position_desc: string;
  job_grade_code: string;
  job_grade_desc: string;
  org_locn_work_code: string;
  org_locn_work_desc: string;
  profile_pic: null;
  department_code: string;
  department_desc: string;
  date_of_birth: Date;
  date_of_join: Date;
  job_classification: string;
  position_start_date: Date;
  position_end_date: Date;
  phone_number: string;
}

interface IAuthorization {
  id: number;
  employee_code: string;
  employee_name: string;
  is_active: string;
  created_at: Date;
  created_by: string;
  technician_level: number;
  active_profile: number;
  active_entities: number;
  is_deleted: boolean;
}

interface IProfile {
  id: number;
  employee_code: string;
  profile_id: number;
  entities_id: number;
  created_at: null;
  created_by: null;
  mst_profile: IMstProfile;
}

interface IMstProfile {
  id: number;
  profile_name: string;
  is_deleted: boolean;
  created_at: null;
  created_by: null;
}

export interface ExtendedRequest extends Request {
  user?: DecodedAuthorization;
}
