import fs from 'node:fs/promises';

// Global vars

let employees = [];

import createPrompt from 'prompt-sync';

let prompt = createPrompt();

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
        await fs.writeFile('./data2.json', JSON.stringify(employees, null, 2));
    } catch (error) {
        console.error('Failed to write data.json');
        throw error;
    }
}

const main = async () => {
    console.log('Hello, main');

    loadData().then(() => {
        console.log('then');
        console.log(`JSON data: ${JSON.stringify(employees, null, 2)}`);
    }).catch(() => {
        console.log('catch');
    });

    console.log('end of main');
}

main();