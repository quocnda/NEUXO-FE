export interface IListProspectList {
  id: number;
  name: string;
  contacts: number;
  creationDate: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
}
