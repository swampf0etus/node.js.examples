import fs from 'node:fs/promises'; //Promises version of fs
import fsc from 'node:fs'; //Callback version of fs

// Read a file using promises
fs.readFile('data.json', 'utf8')
    .then(data => {  // Don't need () with single param
        // .then - when readFile() succeeds
        console.log('.then 1');
        const dataObj = JSON.parse(data);
        console.log(dataObj);
        console.log('Complete');
    })
    .then(() => {
        console.log('.then 2');
        return readFile('data.json');   // Call our readFile() promise func below
    })
    .then((data) => {
        // .then 2 above must succeed (readFile calls resolve()) to get here
        console.log('.then 3');
        console.log(data);
        console.log('end of .then 3');
        
    })
    .catch(err => {
        // .catch - Catch errors from readFile() or anything in the .then block, e.g. JSON.parse()
        console.log('Failed to load and parse json data ');
        throw err;
    });

    // Creating a custom promise API function
    const readFile = async (filename) => {
        return new Promise((resolve, reject) => {
            fsc.readFile('data.json', 'utf8', (err, data) => {
                if(err) {
                    reject(err);
                }
                console.log('calling resolve');
                resolve(data);
            });
        });
    }

console.log('the bottom');