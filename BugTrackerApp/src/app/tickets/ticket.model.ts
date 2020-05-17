export interface Ticket {
  number: number;
  title: string;
  project: string;
  description: string;
  devResources: string[];
  files: any[];
  createdOn: Date;
  status: string;
}
