// TODO: create table for mapping ILogin
interface ILogin {
  employee_code: string;
  employee_name: string;
  supervisor?: string;
  supervisor_name?: string;
  position_code?: string;
  position_desc?: string;
  department_code?: string;
  department_desc?: string;
  phone_number?: string;
  org_locn_work_code?: string;
  org_locn_work_desc?: string;
}
export const generateEmployeeData = async (params: ILogin) => {
  return {
    id: 4657,
    deparment_id: 95,
    grade_id: 48,
    is_active: 1,
    is_presdir: 0,
    is_bod: 0,
    is_depthead: 0,
    created_at: new Date(),
    created_by: 'Scheduler',
    master_ou_code: null,
    employee_code: params.employee_code,
    employee_name: params.employee_name,
    address_line_1: null,
    address_line_2: null,
    mail_id: '',
    employment_ou: 3,
    employment_ou_desc: 'PT AMERTA INDAH OTSUKA',
    supervisor: params?.supervisor ?? '02162',
    supervisor_name: params?.supervisor_name ?? 'Rudy Budiana',
    position_code: 'POS0607',
    position_desc: 'Development Intern',
    job_grade_code: 'S0',
    job_grade_desc: 'Intern',
    org_locn_work_code: 'WL003',
    org_locn_work_desc: 'Factory Sukabumi',
    profile_pic: null,
    department_code: '60211', // dynamic
    department_desc: 'App Development System Subsect', // dynamic
    date_of_birth: new Date('2000-01-02T00:00:00.000Z'),
    date_of_join: new Date('2023-01-03T00:00:00.000Z'),
    job_classification: 'WHCL',
    position_start_date: new Date('2024-06-01T00:00:00.000Z'),
    position_end_date: new Date('2024-06-27T00:00:00.000Z'),
    phone_number: '089657285153', // dynamic
    ...params,
  };
};
