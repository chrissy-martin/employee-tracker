DROP DATABASE IF EXISTS employees_db;

-- employees_db --
CREATE DATABASE employees_db;

-- Uses employees_db --
USE employees_db;

-- table of departments
CREATE TABLE department (
    -- makes ID 
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- table for role
 CREATE TABLE role (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES department(id)
    ON DELETE SET NULL
);

-- table for employee
 CREATE TABLE employee (
    -- gves employee id
    id INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    -- links manager id
    manager_id INT,
    FOREIGN KEY (role_id)
    REFERENCES role(id),
    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
    ON DELETE SET NULL
);

