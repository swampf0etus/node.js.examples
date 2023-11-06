import chalk from "chalk";

export let numEmployeesLogged = 0;

export const logOpject = (obj) => {
    Object.entries(obj).forEach((o) => {
        console.log(`${chalk.blue.bold(o[0])}: ${chalk.green.bold(o[1])}`);
    });
    ++numEmployeesLogged;
}