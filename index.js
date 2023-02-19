const inquirer = require('inquirer');
const mysql = require('mysql2');

require("dotenv").config();

const db = mysql.createConnection(
    {
        host: "localhost",
        user: "root",
        //my SQL passphrase
        password: "I+Love+To+Code+Yay!",
        database: "employees_db",
    },
    console.log(`Connected to the employees_db database.`)
);

db.connect(function (err) {
    if (err) return console.log(err);
    startingQuestions();
})

// Start of the app, prompt questions
const startingQuestions = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'startingquestions',
            message: 'What would you like to do?',
            choices: [
                'View departments',
                'View roles',
                'View employees',
                'Add department',
                'Add role',
                'Add employee',
                'Update employee information'
            ]
        }
    ])
        //Filters the choices to their seperate functions to carry out chosen act
        .then((answers) => {
            switch (answers.startingquestions) {
                case "View departments":
                    viewDepartments();
                    break;
                case 'View roles':
                    viewRoles();
                    break;
                case 'View employees':
                    viewEmployees();
                    break;
                case 'Add department':
                    addDepartment();
                    break;
                case 'Add role':
                    addRole();
                    break;
                case 'Add employee':
                    addEmployee();
                    break;
                case 'Update employee information':
                    updateEmployee();
                    break;
            }
        });
}

const viewDepartments = () => {
    db.query(
        "SELECT department.name AS Departments FROM department",
        (err, results) => {
            //console logs a table of the results
            console.table(results);
            //   goes back to start of questions
            startingQuestions();
        }
    );
}

const viewRoles = () => {
    db.query(
        "SELECT role.title AS Role, role.salary AS Salary, department.name AS Department FROM role JOIN department ON role.department_id = department.id;",
        (err, results) => {
            console.table(results);
            startingQuestions();
        }
    );
}

const viewEmployees = () => {
    db.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, CONCAT(mgr.first_name, mgr.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee mgr ON employee.manager_id = mgr.id",
        (err, results) => {
            if (err) return console.log(err);
            console.table(results);
            startingQuestions();
        });

}

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: "Name the department",
        }
    ])
        .then(answer => {
            const mysql = "INSERT INTO department (name) VALUES (?)";
            db.query(mysql, answer.department, (err, results) => {
                if (err) return console.log(err);
                console.log("Added " + answer.department + " to departments");
                viewDepartments();
            })
        })
}

const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'roles',
            message: "What is the role?",
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the yearly salary?",
        },

    ])
        .then(answer => {
            const params = [answer.roles, answer.salary];
            const roleSql = `SELECT name, id FROM department`;
            // fetches, using db constant, a 
            db.query(roleSql, (err, data) => {
                if (err) return console.log(err);
                const department_var = data.map(({ name, id }) => ({ name: name, value: id }));

                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'department_var',
                        message: "What department is this role in?",
                        choices: department_var
                    }
                ])
                    .then(department_varChoice => {
                        const department_var = department_varChoice.department_var;
                        params.push(department_var);
                        const mysql = 'INSERT INTO role (title, salary, department_id) VALUES (?,?,?)'

                        db.query(mysql, params, (err, result) => {
                            if (err) return console.log(err);
                            console.log("Added " + answer.roles + " to roles");
                            viewRoles();
                        });
                    });
            });
        });
};


const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstname',
            message: "What is emloyee first name?",
        },
        {
            type: 'input',
            name: 'lastname',
            message: "What is employee last name?",
        },
        {
            type: 'input',
            name: 'role',
            message: "What is the role's ID number?",
        },
        {
            type: 'input',
            name: 'manager',
            message: "What is employee manager's ID number?",
        },
    ])
        .then(answer => {
            const role = parseInt(answer.role);
            const manager = parseInt(answer.manager)

            db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES(?,?,?,?)', [answer.firstname, answer.lastname, role, manager])

            console.log(`${answer.firstname} ${answer.lastname} added to employees.`)
            viewEmployees();
        }

        )
}

function updateEmployee() {
    const employeeSql = `SELECT * FROM employee`;
    db.query(employeeSql, (err, data) => {
        if (err) throw err;
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
        inquirer.prompt([
            {
                type: 'list',
                name: 'name',
                message: "Which employee would you like to update?",
                choices: employees
            }
        ])
            .then(empChoice => {
                const employee = empChoice.name; 
                let params = [];
                params.push(employee);
                const roleSql = `SELECT * FROM role`;
                db.query(roleSql, (err, data) => {
                    if (err) throw err;
                    const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                    inquirer.prompt([
                        {
                            type: 'list',
                            name: 'role',
                            message: "What is the employee's new role?",
                            choices: roles
                        }
                    ])
                        .then(roleChoice => {
                            const role = roleChoice.role;
                            params.push(role); 
                            let employee = params[0] 
                            params[0] = role
                            params[1] = employee 
                            const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
                            db.query(sql, params, (err, result) => {
                                if (err) throw err;
                                console.log("Employee has been updated!");
                                viewEmployees();
                            });
                        });
                });
            });
    });
};