use employees_db;

INSERT INTO department 
VALUES
(1, "Sales"),
(2, "Customer Service"),
(3, "Finance"),
(4, "Legal"),
(5, "IT"),
(6, "Human Resources"),
(7, "Purchasing"),
(8, "Security"),
(9, "Research & Development"),
(10, "Marketing"),
(11, "Operations");

INSERT INTO role
    (title, salary, department_id)
VALUES
("Sales Representative", 50000, 1 ),
("Account Manager", 74000, 1),
("Customer Service Rep", 48000, 2),
("Customer Service Manager", 55000, 2),
("Junior Financial Analyst", 70000, 3),
("Accountant", 100000, 3),
("Legal Assistant", 70000, 4),
("Attorney", 150000, 4),
("Junior Developer" , 70000, 5),
("Technical Program Manager", 160000, 5),
("Recruiter", 45000, 6),
("HR Director", 82000, 6),
("Procurement Analyst", 50000, 7),
("Purchasing Manager", 140000, 7),
("Security Specialist", 50000, 8),
("Security Manager", 96000, 8),
("Data Analyst", 80000, 9),
("Research Manager", 180000, 9),
("Marketing Assistant", 40000, 10),
("Product Marketing Manager", 120000, 10),
("Operations Assistant", 40000, 11),
("Strategy & Operations Manager", 120000, 11);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, NULL),
    ('Mike', 'Chan', 2, NULL),
    ('Ashley', 'Rodriguez', 3, NULL),
    ('Kevin', 'Tupik', 4, NULL),
    ('Kunal', 'Singh', 5, NULL),
    ('Malia', 'Brown', 6, NULL),
    ('Sarah', 'Lourd', 7, NULL),
    ('Tom', 'Allen', 8, NULL),
    ("Lyle", "Cobb", 12, null),
    ("Ian", "Neal", 20, null);
