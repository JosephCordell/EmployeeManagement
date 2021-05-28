const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

// const sequelize = require('./config/connection');


const init = () => {
    const welcome = logo({ name: "Employee Management System" }).render();
    
    console.log(welcome);
    
    getStarted();
}

const exitQuestions = () => {
    console.log("Goodbye!");
    process.exit();
  }

const getStarted = () => {



    exitQuestions()
}


init();


