const logo = require("asciiart-logo");
const interaction = require("./public/js/interaction.js");
require("console.table");

// const sequelize = require('./config/connection');

const init = () => {
  const welcome = logo({ name: "Employee Management System" }).render();

  console.log(welcome);

  interaction.getQs();
};

init();
