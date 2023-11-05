import { error } from 'node:console';
import fs from 'node:fs/promises';
import createPrompt from 'prompt-sync';

let prompt = createPrompt();

// Global vars

let employees = [];
let currenceData;

const getCurrencyConversionData = async () => {
    console.log('Loading currency conversion data via API call...');
    const options = {
        method: 'GET',
        redirect: 'follow'
    }

    const apiKey = 'b78cb32317d1e2b1c3d123b8b4366f21';
    const response = await fetch(`http://api.exchangeratesapi.io/v1/latest?access_key=${apiKey}`, options);

    if(!response.ok) {
        throw new Error(`Error calling API. Status: ${response.status}`);
    }

    currenceData = await response.json();
}

const getSalary = (amountUSD, currency) => {
    //As API base currency is EUR and salaries are stored in USD, we have to conver to USD first
    const amount = (currency === 'USD') ? amountUSD : (amountUSD / currenceData.rates['USD']) * currenceData.rates[currency];
    const formatter = Intl.NumberFormat('us-US', {
        style: 'currency',
        currency: currency
    });
    return formatter.format(amount);
}

const logEmployee = (employee) => {
    Object.entries(employee).forEach(entry => {
        //console.log(`${entry[0]}: ${entry[1]}`)
        if(entry[0] !== 'salaryUSD' || entry[0] !== 'localCurrency') {
            console.log(`${entry[0]}: ${entry[1]}`);
        }
    });
    console.log(`Salary USD: ${getSalary(employee.salaryUSD, 'USD')}`);
    console.log(`Local Salary: ${getSalary(employee.salaryUSD, employee.localCurrency)}`);
}

const loadData = async () => {
    console.log('Loading employee data');
    try {
        const fileData = await fs.readFile('./data.json', 'utf8');
        employees = JSON.parse(fileData);
    } catch (error) {
        console.error('Failed to load data.json');
        throw error;
    }
}

const writeData = async () => {
    console.log('Writing employee data');
    try {
        await fs.writeFile('./data.json', JSON.stringify(employees, null, 2));
    } catch (error) {
        console.error('Failed to write data.json');
        throw error;
    }
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
    employee.isActive = getInput('Active employee? (yes/no): ', isBooleanInputValid, (i) => { return (i.toLowerCase() === 'yes');});
    
    // Before calling getInput here, we call isIntegerValid(), which returns a function (pointer) to a validator
    let day = getInput('Enter Start date day: ', isIntegerValid(1, 31));
    let month = getInput('Enter Start date month: ', isIntegerValid(1, 12));
    let year = getInput('Enter Start date year: ', isIntegerValid(1970, 2007));
    employee.startDate = new Date(year, month - 1, day);
    employee.salaryUSD = getInput('Enter salary: ', isIntegerValid(10000, 1000000));
    employee.localCurrency = getInput('Enter currency code: ', isCurrenceCodeValid);

    //console.log(`Employee added: ${JSON.stringify(employee, null, 2)}`);
    
    // employee.startDate
    employees.push(employee);
    await writeData();
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

// Concurrently call loadData() and getCurrencyConversionData()
Promise.all([loadData(), getCurrencyConversionData()])
    .then(main)
    .catch((err) => {
        console.error(`Could not complete start-up.  Error: ${err.message}`);
        throw err;
    });