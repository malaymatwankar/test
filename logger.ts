import { callbackify } from "util";

/**
 * 
 * @param target 
 * @param name 
 * @param descriptor
 * 
 * This logging decorator only works for error first callbacks with only 2 params error and response 3rd parameter 
 * is not supported it will only print 2 cases with err and res
 */ 
const {promisify} = require('util');
export function log(target, name, descriptor) {
    const original = descriptor.value;
    if (typeof original === 'function') {
        descriptor.value = function (...args) {
            // args.splice(-1);// Remove the last parameter that is callback itself as it has been promisified...
            console.log(`Executing ${name} with parameters ${args}`);
            // Execute function like a function with promise
            return original.apply(this, args).then(data => {
                console.log(`Execution of ${name} completed successfully`);
            }).catch(error => {
                console.log(`Execution of ${name} failed an error occurred ${error}`);
            });
        }
    }
    return descriptor;
}

export function performanceLog(target, name, descriptor) {
    const original = promisify(descriptor.value);
    if (typeof original === 'function') {
        descriptor.value = function (...args) {
            // args.splice(-1);// Remove the last parameter that is callback itself as it has been promisified...
            // Here target.constructor.name will change if code is minified
            console.log(`Executing ${target.constructor.name}.${name} with parameters ${args}`);
            let start: any = new Date();
            // This will not wait for the callback to complete it's a BUG...
            // const promise = Promise.resolve(original.apply(this, args));
            // var someThing;
            // const promise = original.apply(this, args);            
            // promise.then(data => {
            //     someThing = data;
            //     let end: any = new Date();
            //     end = end - start;
            //     console.log(`\nExecution of ${target.constructor.name}.${name} completed successfully in ${end / 1000} seconds`);
            // }).catch(error => {
            //     someThing = error;
            //     let end: any = new Date();
            //     end = end - start;
            //     console.log(`\nExecution of ${target.constructor.name}.${name} completed with error in ${end / 1000} seconds`);
            // });
            // console.log("############### ",someThing);
            // return promise;

            // This is causing the result to execute after logs...
            const onlyArgs = args.slice(0, args.length - 1);
            const callback = args[args.length - 1];
            original.apply(this, onlyArgs)
            .then(data => {
                let end: any = new Date();
                end = end - start;
                console.log(`\nExecution of ${target.constructor.name}.${name} completed successfully in ${end / 1000} seconds`);
                callback(null, data);
            })
            .catch(err => {
                let end: any = new Date();
                end = end - start;
                console.log(`\nExecution of ${target.constructor.name}.${name} completed with error in ${end / 1000} seconds`);
                callback(err);});
        }
    }
    return descriptor;
}

// REFER THIS :: https://hackernoon.com/transforming-callbacks-into-promises-and-back-again-e274c7cf7293
// function promisify(func) {
//     return (...args) =>
//         new Promise((resolve, reject) => {
//             const callback = (err, data) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(data);
//                 }
//             }
//             func.apply(this, [...args, callback]);
//         })
// }

// function callbackifyF(func) {
//     return (...args) => {
//         const onlyArgs = args.slice(0, args.length - 1)
//         const callback = args[args.length - 1]

//         func.apply(this, onlyArgs)
//             .then(data => callback(null, data))
//             .catch(err => callback(err))
//     }
// }
