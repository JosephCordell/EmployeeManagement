const inquirer = require("inquirer");
const { prompt } = require("inquirer");
const connection = require("../../config/connection");
const mysql = require("mysql");
require("console.table");

const findAllEmployees = () => {
  const employees = connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;`
  );
  return employees;
};

const viewEmployees = async () => {
  const employees = await findAllEmployees();

  console.log("\n");
  console.table(employees);
  getQs();
};

const viewEmployeesByDepartment = async () => {
  const departments = await connection.query(
    "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
  );

  const departmentOptions = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));

  const { departmentId } = await inquirer.prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to see?",
      choices: departmentOptions,
    },
  ]);

  const employees = await connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id = ${departmentId}`
  );

  if (employees.length === 0) {
    console.log("Currently no employees in that department");
  } else {
    console.log("\n");
    console.table(employees);
  }

  getQs();
};

const viewEmployeesByManager = async () => {
  const managers = await findAllEmployees();

  const managerOptions = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { managerId } = await inquirer.prompt([
    {
      type: "list",
      name: "managerId",
      message: "Which employee do you want to see direct reports for?",
      choices: managerOptions,
    },
  ]);

  const employees = await connection.query(
    `SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ${managerId};
    `
  );

  if (employees.length === 0) {
    console.log("That employee has no managers");
  } else {
    console.log("\n");
    console.table(employees);
  }

  getQs();
};

const addEmployee = async () => {
  const employee = await inquirer.prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
    },
  ]);

  const roles = await connection.query(
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;`
  );

  const roleOptions = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleOptions,
  });

  employee.role_id = roleId;

  const managers = await findAllEmployees();

  const managerOptions = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerOptions,
  });

  employee.manager_id = managerId;

  await connection.query(
    `insert into employee (first_name, last_name, role_id, manager_id) values ('${employee.first_name}', '${employee.last_name}', '${employee.role_id}', '${employee.manager_id}')`
  );

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  getQs();
};

const removeEmployee = async () => {
  const employees = await findAllEmployees();

  const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee would you like to remove",
      loop: false,
      choices: employeeOptions,
    },
  ]);

  await connection.query(`delete from employee where id = '${employeeId}'`);

  console.log("Employee has been deleted from the database");

  getQs();
};

const updateEmployeeRole = async () => {
  const employees = await findAllEmployees();

  const employeeOptions = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want change?",
      choices: employeeOptions,
    },
  ]);

  const roles = await connection.query(
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;`
  );

  const roleOptions = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to give them",
      choices: roleOptions,
    },
  ]);

  connection.query(
    `UPDATE employee SET role_id = ${roleId} WHERE id = ${employeeId}`
  );

  console.log("Employee's role has been updated");

  getQs();
};

const viewRoles = async () => {
  const roles = await connection.query(
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;`
  );

  console.table(roles);
  getQs();
};

const addRole = async () => {
  const departments = await connection.query(
    "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
  );

  const departmentOptions = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));

  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the new role?",
    },
    {
      name: "salary",
      message: "What salary will this role have?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department has this role?",
      choices: departmentOptions,
    },
  ]);

  await connection.query(
    `INSERT INTO role (title, salary, department_id) values ('${role.title}', '${role.salary}', '${role.department_id}')`
  );

  console.log(`Added ${role.title} to the database`);

  getQs();
};

const removeRole = async () => {
  const roles = await connection.query(
    `SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;`
  );

  const roleOptions = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message:
        "Which role would you like to remove? (Warning: This will also remove employees)",
      choices: roleOptions,
    },
  ]);

  await connection.query(`DELETE FROM role WHERE id = ${roleId}`);

  console.log(`That role has been deleted`);

  getQs();
};

const viewDepartments = async () => {
  const departments = await connection.query(
    "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
  );

  console.log("\n");
  console.table(departments);

  getQs();
};

const addDepartment = async () => {
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the new department?",
    },
  ]);

  await connection.query(
    `INSERT INTO department (name) value ('${department.name}');`
  );

  console.log(`${department.name} has been added to the database`);
  getQs();
};

const removeDepartment = async () => {
  const departments = await connection.query(
    "SELECT department.id, department.name, SUM(role.salary) AS utilized_budget FROM department LEFT JOIN role ON role.department_id = department.id LEFT JOIN employee ON employee.role_id = role.id GROUP BY department.id, department.name"
  );

  const departmentOptions = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));

  const { departmentId } = await prompt({
    type: "list",
    name: "departmentId",
    message:
      "Which department do you want to remove? (Warning: This will also remove the roles and employees in the department)",
    choices: departmentOptions,
  });
  await connection.query(`DELETE FROM department WHERE id = ${departmentId}`);

  console.log(`The Department has been deleted`);

  getQs();
};

const getQs = async () => {
  inquirer
    .prompt({
      name: "q",
      type: "list",
      message: "What would you like to do today?",
      choices: [
        "View every employee",
        "View employees by department?",
        "View employees by manager?",
        "Add employee",
        "Remove employee",
        "Update employee role",
        "View all rolls",
        "Add role",
        "Remove role",
        "View all departments",
        "Add department",
        "Remove department",
        "Quit",
      ],
      loop: false,
    })
    .then((annswer) => {
      switch (annswer.q) {
        case "View every employee":
          viewEmployees();
          break;
        case "View employees by department?":
          viewEmployeesByDepartment();
          break;
        case "View employees by manager?":
          viewEmployeesByManager();
          break;
        case "Add employee":
          addEmployee(); //create function
          break;
        case "Remove employee":
          removeEmployee();
          break;
        case "Update employee role":
          updateEmployeeRole();
          break;
        case "View all rolls":
          viewRoles(); // create function
          break;
        case "Add role":
          addRole(); // create function
          break;
        case "Remove role":
          removeRole();
          break;
        case "View all departments":
          viewDepartments(); // create function
          break;
        case "Add department":
          addDepartment(); // Create Function
          break;
        case "Remove department":
          removeDepartment();
          break;
        case "Quit":
          connection.end(console.log("goodbye"));
          break;
      }
    });
};

module.exports = { getQs };
