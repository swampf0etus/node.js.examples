import fs from "node:fs"; //Callback version of fs module

fs.readFile('data.json', 'utf8', (err, data) => {
    if(err) {
        console.log('Error reading file');
        throw(err);
    }

    try {
        const objData = JSON.parse(data);
        console.log(objData);
        console.log('Complete');
    } catch(err) {
        console.error("Failed to parse json data.");
        throw(err);
    }
});

console.log('This happened.');
