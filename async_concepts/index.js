import { error } from 'node:console';
import createPrompt from 'prompt-sync';
//import { loadData, writeData } from './data.js';
import { getAllEmployees, insertEmployee } from './database.js';
import { getCurrencyConversionData, getSalary } from './currency.js';

let prompt = createPrompt({sigint: true});

// Global vars

let employees = [];
let currenceData;

const logEmployee = (employee) => {
    Object.entries(employee).forEach(entry => {
        //console.log(`${entry[0]}: ${entry[1]}`)
        if(entry[0] !== 'salaryUSD' || entry[0] !== 'localCurrency') {
            console.log(`${entry[0]}: ${entry[1]}`);
        }
    });
    console.log(`Salary USD: ${getSalary(employee.salaryUSD, 'USD', currenceData)}`);
    console.log(`Local Salary: ${getSalary(employee.salaryUSD, employee.localCurrency, currenceData)}`);
}

function listEmployees() {
    console.log('List employees-------');

    employees.forEach(e => {
        logEmployee(e);
        prompt('Press enter to continue.');
    });
    console.log('Employee list complete.');
}

function getInput(promtText, validator, transformer) {
    let value = prompt(promtText);

    if (validator && !validator(value)) {
        console.error('Invalid input');
        return getInput(promtText, validator, transformer);  //recursion! no likey
    }

    if (transformer) {
        return transformer(value);
    }

    return value;
}

// Validator functions
const isCurrenceCodeValid = (code) => {
    const currencyCodes = Object.keys(currenceData.rates);
    return (currencyCodes.indexOf(code) > -1);
}

function isStringInputValid(input) {
    return (input) ? true : false;
}

function isBooleanInputValid(input) {
    return (input.toLowerCase() === 'yes' || input.toLowerCase() === 'no');
}

function isIntegerValid(min, max) {
    //Here we return an anonymous function (pointer) to validate
    return (input) => {
        let numVal = Number(input);

        if(!Number.isInteger(numVal) || numVal < min || numVal > max) {
            return false;
        }

        return true;
    }
}

const getNextEmployeeId = () => {
    if(employees.length === 0) {
        return 1;
    }
    const maxId = Math.max(...employees.map((e) => {return e.id}));
    return maxId + 1;
}

async function addEmployee() {
    console.log('List employees-------');

    let employee = {};

    employee.id = getNextEmployeeId();
    // Calls it getInput() here pass a function (pointer) to a validator (notice no ()s )
    employee.firstName = getInput('First name: ', isStringInputValid);
    employee.lastName = getInput('Last name: ', isStringInputValid);
    employee.email = getInput('Email address: ', isStringInputValid);
    employee.isActive = getInput('Active employee? (yes/no): ', isBooleanInputValid, (i) => { return (i.toLowerCase() === 'yes');});
    
    // Before calling getInput here, we call isIntegerValid(), which returns a function (pointer) to a validator
    let day = getInput('Enter Start date day: ', isIntegerValid(1, 31));
    let month = getInput('Enter Start date month: ', isIntegerValid(1, 12));
    let year = getInput('Enter Start date year: ', isIntegerValid(2010, 2023));
    employee.startDate = new Date(year, month - 1, day);

    day = getInput('Enter DOB date day: ', isIntegerValid(1, 31));
    month = getInput('Enter DOB date month: ', isIntegerValid(1, 12));
    year = getInput('Enter DOB date year: ', isIntegerValid(1970, 2007));
    employee.dateBirth = new Date(year, month - 1, day);

    employee.salaryUSD = getInput('Enter salary: ', isIntegerValid(10000, 1000000));
    employee.localCurrency = getInput('Enter currency code: ', isCurrenceCodeValid);

    // Write to file
    //employees.push(employee);
    //await writeData(employees);

    //Write to DB
    await insertEmployee(employee);
}

// Search functions ------------------

function searchById() {
    console.log('Search for employee by id -------');

    const id = getInput('Employee id: ', null, Number);
    const result = employees.find((e) => {return e.id === id});
    // Shorter version
    // single param doesn't need(), slingle line doesn't require {} and returns result of single operation
    //const result = employees.find(e => e.id === id);

    if(result) {
        //console.log(`Found employee: ${JSON.stringify(result, null, 2)}`);
        logEmployee(result);
    } else {
        console.log(`Failed to find employee with id: ${id}`);
    }
}

function searchByName() {
    console.log('Search for employee by Name -------');

    const firstName = getInput('Employee first name: ').toLowerCase();
    const lastName = getInput('Employee last name: ').toLowerCase();
    const result = employees.filter((e) => {
        if(firstName && !e.firstName.toLowerCase().includes(firstName)) {
           return false; 
        }
        if(lastName && !e.lastName.toLowerCase().includes(lastName)) {
            return false;
        }
        return true;
    });
    
    if(result) {
        console.log(`\nFound ${result.length} employees:\n`);
        result.forEach(element => {
            logEmployee(element);
            console.log('');
        });
    } else {
        console.log(`Failed to find employee with name: ${name}`);
    }
}

const main = async () => {

    const command = process.argv[2].toLowerCase();

    switch (command) {
        case "list":
            listEmployees();
            break;

        case "add":
            await addEmployee();
            break;

        case "search-by-id":
            searchById();
            break;

        case "search-by-name":
            searchByName();
            break;

        default:
            console.log('Invalid command, exiting');
            process.exit(1);
            break;
    }

    process.exit(0);

    console.log('Hello, main');

    loadData().then(() => {
        console.log('then');
        console.log(`JSON data: ${JSON.stringify(employees, null, 2)}`);
    }).catch(() => {
        console.log('catch');
    });

    console.log('end of main');
}
// Load from file
// Concurrently call loadData() and getCurrencyConversionData()
// Promise.all([loadData(), getCurrencyConversionData()])

// Load from database
// Concurrently call getAllEmployees() and getCurrencyConversionData()
Promise.all([getAllEmployees(), getCurrencyConversionData()])
    .then((results) => {
        employees = results[0];
        currenceData = results[1];
        return main();
    })
    .catch((err) => {
        console.error(`Could not complete start-up.  Error: ${err.message}`);
        throw err;
    });