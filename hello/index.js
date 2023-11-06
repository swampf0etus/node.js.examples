import fs from "node:fs";

const sleep = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

const theName = 'World';

console.log(`CWD: ${process.cwd()}`);
console.log(`Hello, ${theName}!`);
console.log("before sleep");
await sleep(3000);
console.log("after sleep");