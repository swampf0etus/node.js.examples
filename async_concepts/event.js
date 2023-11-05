import EventEmeitter from "node:events";

const emitter = new EventEmeitter();

emitter.on('hello', (message) => {
    console.log(`Event handled: ${message}`);
});

setTimeout(() => {
    emitter.emit('hello', 'I said "hello"');
}, 3000);