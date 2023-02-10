USE employees_db;

INSERT INTO department (name)
VALUES ("engineering"),
    ("finance"),
    ("marketing"),
    ("sales");

INSERT INTO role (title, salary, department_id)
VALUES ("software engineer", 120000, 1),
    ("project manager", 90000, 1),
    ("engineering manager", 225000, 1),
    ("accountant", 70000, 2),
    ("accounting manager", 120000, 2),
    ("product marketing manager", 50000, 3),
    ("marketing lead", 150000, 3),
    ("sales rep", 85000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES('George', 'Jetson', 3, null),
('Jane', 'Jefferson', 3, 1),
('John', 'Smith', 1, 2),
('Deepak', 'Sohal', 1, 2),
('Myshka', 'Martin-Sohal', 2, 1),
('Sasha', 'Martin-Sohal', 4, 1);
