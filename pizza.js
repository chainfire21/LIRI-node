/**
 * Pizza delivery prompt example
 * run example by writing `node pizza.js` in your console
 */

'use strict';
var inquirer = require('inquirer');

console.log('Hi, welcome to Node Pizza');

const questions = require("./questions");

inquirer.prompt(questions.array).then(answers => {
  console.log('\nOrder receipt:');
  console.log(JSON.stringify(answers, null, '  '));
});