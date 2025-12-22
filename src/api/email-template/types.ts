export interface IParamsEmailTemplate {
  search?: string;
}
export interface IResponseEmailTemplate {
  id: string;
  template_name: string;
  template_subject: string;
  template_content: string;
  updated_at: string;
  attachments: Array<{ file_name: string; file_path: string }>;
}

export interface IBodyCreateEmailTemplate {
  id?: string;
  template_name: string;
  template_subject: string;
  template_content: string;
  attachments?: Array<{ file_name: string; file_path: string }>;
}

export interface IRequestEmailSignature {
  signature_name: string;
  signature_html: string;
  id?: string;
}
