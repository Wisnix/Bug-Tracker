import { Employee } from "../employee/employee.model";

export interface Comment {
  author: Employee;
  content: String;
  createdOn: Date;
}
