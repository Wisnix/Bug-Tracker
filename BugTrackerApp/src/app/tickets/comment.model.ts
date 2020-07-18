import { Employee } from "../employees/employee.model";

export interface Comment {
  author: Employee;
  content: String;
  createdOn: Date;
}
