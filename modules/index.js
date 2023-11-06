import chalk from "chalk";
import { logOpject, numEmployeesLogged } from "./logging.js";

// console.log(`${chalk.blue.bold('First name : ')} Brett`);
// console.log(`${chalk.green.bold('Last name  : ')} Graham`);

const employee = {
    "id": 0,
    "email": "lauren_shaffer@globomantics.com",
    "firstName": "Lauren",
    "lastName": "Shaffer",
    "salaryUSD": 246463,
    "localCurrency": "PEN",
    "dateBirth": "1988-02-08",
    "startDate": "2006-02-14",
    "isActive": true
  };

logOpject(employee);
logOpject(employee);
logOpject(employee);
logOpject(employee);
console.log(`${chalk.red.bold('Employees logged:')} ${numEmployeesLogged}`);
