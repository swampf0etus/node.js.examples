import { error } from "node:console";
import fs, { readFile } from "node:fs/promises";
import { cwd } from "node:process";

async function loadData() {
    try {
    console.log(`CWD: ${cwd()}`);
    const data = await fs.readFile('data.json', 'utf8');
    const dataObj = JSON.parse(data);
    console.log(dataObj);
    console.log('Complete');
    } catch(err) {
        console.log('error reading or parsing json data');
        throw err;
    }
}

loadData().then(() => console.log('promise completed'));