drop database if exists employees_db;
create database employees_db;

use employees_db;

create table department (
  id int auto_increment primary key,
  name varchar(30) unique not null
);

create table role (
  id int auto_increment primary key,
  title varchar(30) unique not null,
  salary DECIMAL not null,
  department_id int not null,
  foreign key (department_id) references department(id)
);

create table employee (
  id int auto_increment primary key,
  first_name varchar(30) not null,
  last_name varchar(30) not null,
  role_id int not null,
  manager_id int,
  foreign key (role_id) references role(id),
  constraint manager_fk foreign key (manager_id) references employee(id)
);