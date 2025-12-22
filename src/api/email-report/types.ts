export interface IParamsEmailReport {
  start_date?: string;
  end_date?: string;
  list_user_id?: string;
}
export interface IEmailReport {
  report_data: IResponseEmailReport[];
  average_new_email_sent: string;
  average_new_email_reply: string;
  average_reply_rate: string;
}
export interface IResponseEmailReport {
  user_id: string;
  user_name: string;
  unique_domain_sent: string;
  new_email_sent: string;
  new_email_follow_up_1: string;
  new_email_follow_up_2: string;
  new_email_follow_up_3: string;
  new_email_follow_up_4: string;
  new_email_follow_up_5: string;
  new_email_follow_up_5_plus: string;
  new_email_replied: string;
  replied_rate: string;
  lst_email: string[];
}
