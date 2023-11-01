import { error } from "node:console";
import fs, { readFile } from "node:fs/promises";

// async function loadData() {
//     try {
//     const data = await fs.readFile('data.json', 'utf8');
//     const dataObj = JSON.parse(data);
//     console.log(dataObj);
//     console.log('Complete');
//     } catch(err) {
//         console.log('error reading or parsing json data');
//         throw err;
//     }
// }

// loadData().then(() => console.log('promise completed'));

try {
    // Although we are using await here, we don't need to be inside of
    // an async function, as we are a module, which is treat as async
    const data = await fs.readFile('data.json', 'utf8');
    const dataObj = JSON.parse(data);
    console.log(dataObj);
    console.log('Complete');
    } catch(err) {
        console.log('error reading or parsing json data');
        throw err;
    }