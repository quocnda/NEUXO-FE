export interface IBodyCreateSequence {
  signature: string;
  campaign_name: string;
  list_email?: string[];
  custom_sequence?: string[];
  source?: string;
  enable_bimonthly?: boolean;
  max_email_bimonthly?: number;
  user_hot_trigger?: boolean;
  hot_trigger_condition?: string[];
}

export interface IParamsPreviewEmail {
  email: string;
  sequence_id: string;
  source?: string;
  event_id?: string;
}

export interface IBodySubmitSequence {
  sequence_id: string;
  content_email: {
    email: string;
    data: {
      stepNum: number;
      subject: string;
      content: string;
    }[];
  }[];
  source?: string;
  event_id?: string;
}
