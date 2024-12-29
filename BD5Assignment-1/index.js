let express = require('express');
let app = express();
let { sequelize } = require('./lib/index');
let { employee } = require('./models/employee.model.js');
let { department } = require('./models/department.model.js');
let { role } = require('./models/role.model.js');
let { employeeRole } = require('./models/employeeRole.model.js');
let { employeeDepartment } = require('./models/employeeDepartment.model.js');
const PORT = process.env.PORT || 3000;
app.use(express.json());
// Endpoint to seed database
app.get('/seed_db', async (req, res) => {
  await sequelize.sync({ force: true });

  const departments = await department.bulkCreate([
    { name: 'Engineering' },
    { name: 'Marketing' },
  ]);

  const roles = await role.bulkCreate([
    { title: 'Software Engineer' },
    { title: 'Marketing Specialist' },
    { title: 'Product Manager' },
  ]);

  const employees = await employee.bulkCreate([
    { name: 'Rahul Sharma', email: 'rahul.sharma@example.com' },
    { name: 'Priya Singh', email: 'priya.singh@example.com' },
    { name: 'Ankit Verma', email: 'ankit.verma@example.com' },
  ]);

  // Associate employees with departments and roles using create method on junction models
  await employeeDepartment.create({
    employeeId: employees[0].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[0].id,
    roleId: roles[0].id,
  });

  await employeeDepartment.create({
    employeeId: employees[1].id,
    departmentId: departments[1].id,
  });
  await employeeRole.create({
    employeeId: employees[1].id,
    roleId: roles[1].id,
  });

  await employeeDepartment.create({
    employeeId: employees[2].id,
    departmentId: departments[0].id,
  });
  await employeeRole.create({
    employeeId: employees[2].id,
    roleId: roles[2].id,
  });

  return res.json({ message: 'Database seeded!' });
});

// get employeeRole
async function getEmployeeRoles(employeeId) {
  const employeeRoles = await employeeRole.findAll({
    where: { employeeId },
  });

  let roleData;
  for (let empRole of employeeRoles) {
    roleData = await role.findOne({
      where: { id: empRole.roleId },
    });
  }

  return roleData;
}
// Helper function to get employee's associated departments
async function getEmployeeDepartments(employeeId) {
  const employeeDepartments = await employeeDepartment.findAll({
    where: { employeeId },
  });

  let departmentData;
  for (let empDep of employeeDepartments) {
    departmentData = await department.findOne({
      where: { id: empDep.departmentId },
    });
  }

  return departmentData;
}

// Helper function to get employee details with associated departments and roles
async function getEmployeeDetails(employeeData) {
  const department = await getEmployeeDepartments(employeeData.id);
  const role = await getEmployeeRoles(employeeData.id);

  return {
    ...employeeData.dataValues,
    department,
    role,
  };
}

// Exercise 1: Get All Employees
async function getAllEmployee() {
  let employees = await employee.findAll();

  // Map through each employee and fetch their details
  let results = await Promise.all(
    employees.map(async (emp) => {
      return await getEmployeeDetails(emp);
    })
  );

  return { employees: results };
}

app.get('/employees', async (req, res) => {
  try {
    let response = await getAllEmployee();
    if (response.employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Exercise 2: Get Employee by ID
// /employees/details/:id

async function getEmployee(id) {
  let employe = await employee.findOne({ where: { id } });
  let results = await getEmployeeDetails(employe);

  return { employees: results };
}
app.get('/employees/details/:id', async (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = await getEmployee(id);
    if (result.employees.length === 0) {
      return res
        .status(404)
        .json({ message: 'No employees found by Id: ' + id });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 3: Get Employees by Department
// employees/department/:departmentId

async function getEmployeeByDept(departmentID) {
  try {
    let empDPT = await employeeDepartment.findAll({
      where: { departmentId: departmentID },
    });
    if (empDPT.length === 0) {
      return { employees: [] };
    }
    let results = [];
    for (let empDep of empDPT) {
      let emp = await employee.findOne({ where: { id: empDep.employeeId } });
      if (emp) {
        let employeeDetails = await getEmployeeDetails(emp);
        results.push(employeeDetails);
      }
    }
    return { employees: results };
  } catch (error) {
    console.error('Error in getEmployeeByDept:', error.message);
    throw error;
  }
}

app.get('/employees/department/:departmentId', async (req, res) => {
  try {
    let departmentID = parseInt(req.params.departmentId);
    let result = await getEmployeeByDept(departmentID);
    if (result.employees.length === 0) {
      res
        .status(500)
        .json({ message: 'No employe found by department ID' + departmentID });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 4: Get All Employees by Role /employees/role/:roleId
async function getEmployeeByRole(roleID) {
  try {
    let empRole = await employeeRole.findAll({
      where: { roleId: roleID },
    });
    if (empRole.length === 0) {
      return { employees: [] };
    }
    let results = [];
    for (let empDep of empRole) {
      let emp = await employee.findOne({ where: { id: empDep.employeeId } });
      if (emp) {
        let employeeDetails = await getEmployeeDetails(emp);
        results.push(employeeDetails);
      }
    }
    return { employees: results };
  } catch (error) {
    console.error('Error in getEmployeeByDept:', error.message);
    throw error;
  }
}

app.get('/employees/role/:roleId', async (req, res) => {
  try {
    let roleID = parseInt(req.params.roleId);
    let result = await getEmployeeByRole(roleID);
    if (result.employees.length === 0) {
      res
        .status(500)
        .json({ message: 'No employe found by department ID' + departmentID });
    }
    return res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 5: Get Employees Sorted by Name "/employees/sort-by-name"
async function findEmployeeSortedByName() {
  let employees = await employee.findAll({
    order: [['name', 'ASC']],
  });
  let results = await Promise.all(
    employees.map(async (emp) => {
      return await getEmployeeDetails(emp);
    })
  );

  return { employees: results };
}
app.get('/employees/sort-by-name', async (req, res) => {
  try {
    let employees = await findEmployeeSortedByName();
    if (employees.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }
    return res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 6: Add a New Employee "/employees/new"
async function addNewEmp(newEmp) {
  try {
    const { name, email, departmentId, roleId } = newEmp;

    // Validate required fields
    if (!name || !email || !departmentId || !roleId) {
      throw new Error(
        'All fields are required: name, email, departmentId, roleId.'
      );
    }

    // Step 1: Check for duplicate employee email
    const existingEmployee = await employee.findOne({ where: { email } });
    if (existingEmployee) {
      throw new Error('Employee with this email already exists.');
    }

    // Step 2: Verify department and role existence
    const departmentExists = await department.findByPk(departmentId);
    if (!departmentExists) {
      throw new Error(`Department with ID ${departmentId} does not exist.`);
    }

    const roleExists = await role.findByPk(roleId);
    if (!roleExists) {
      throw new Error(`Role with ID ${roleId} does not exist.`);
    }

    // Step 3: Add the employee to the 'employee' table
    const newEmployee = await employee.create({
      name,
      email,
    });

    // Step 4: Add an entry to the 'employeeDepartment' table
    await employeeDepartment.create({
      employeeId: newEmployee.id,
      departmentId,
    });

    // Step 5: Add an entry to the 'employeeRole' table
    await employeeRole.create({
      employeeId: newEmployee.id,
      roleId,
    });

    // Step 6: Fetch the associated department and role details
    const departmentData = await department.findOne({
      where: { id: departmentId },
    });

    const roleData = await role.findOne({
      where: { id: roleId },
    });

    // Step 7: Construct the final response
    const response = {
      id: newEmployee.id,
      name: newEmployee.name,
      email: newEmployee.email,
      createdAt: newEmployee.createdAt,
      updatedAt: newEmployee.updatedAt,
      department: departmentData
        ? {
            id: departmentData.id,
            name: departmentData.name,
            createdAt: departmentData.createdAt,
            updatedAt: departmentData.updatedAt,
          }
        : null,
      role: roleData
        ? {
            id: roleData.id,
            title: roleData.title,
            createdAt: roleData.createdAt,
            updatedAt: roleData.updatedAt,
          }
        : null,
    };

    return response;
  } catch (error) {
    console.error('Error adding a new employee:', error.message);
    if (error.errors) {
      console.error('Validation Error Details:', error.errors);
    }
    throw error;
  }
}

app.post('/employees/new', async (req, res) => {
  try {
    const newEmp = req.body.newEmp;
    const response = await addNewEmp(newEmp);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

// Exercise 7: Update Employee Details "/employees/update/:id"
async function updateEmployeeDetails(id, updateData) {
  try {
    const { name, email, departmentId, roleId } = updateData;
    const employeeData = await employee.findByPk(id);
    if (!employeeData) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    // Update employee fields if present in request body
    if (name) employeeData.name = name;
    if (email) employeeData.email = email;

    // Save the updated employee record
    await employeeData.save();

    // Handle departmentId updates
    if (departmentId) {
      // Delete existing department associations
      await employeeDepartment.destroy({
        where: { employeeId: employeeData.id },
      });

      // Create new department association
      await employeeDepartment.create({
        employeeId: employeeData.id,
        departmentId,
      });
    }

    // Handle roleId updates
    if (roleId) {
      // Delete existing role associations
      await employeeRole.destroy({
        where: { employeeId: employeeData.id },
      });

      // Create new role association
      await employeeRole.create({
        employeeId: employeeData.id,
        roleId,
      });
    }

    // Fetch the updated employee details
    const updatedEmployee = await getEmployeeDetails(employeeData);

    return updatedEmployee;
  } catch (error) {
    console.error('Error updating employee details:', error.message);
    throw error;
  }
}

app.put('/employees/update/:id', async (req, res) => {
  try {
    const employeeId = parseInt(req.params.id);
    const updateData = req.body;

    // Validate if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        message: 'No data provided to update.',
      });
    }

    // Update employee details
    const updatedEmployee = await updateEmployeeDetails(employeeId, updateData);
    return res.status(200).json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Exercise 8: Delete an Employee "/employees/delete"
async function deleteEmployeeById(id) {
  try {
    // Check if the employee exists
    const employeeData = await employee.findByPk(id);
    if (!employeeData) {
      throw new Error(`Employee with ID ${id} not found.`);
    }

    // Delete records from employeeDepartment table
    await employeeDepartment.destroy({
      where: { employeeId: id },
    });

    // Delete records from employeeRole table
    await employeeRole.destroy({
      where: { employeeId: id },
    });

    // Delete the employee record
    await employee.destroy({
      where: { id },
    });

    return { message: `Employee with ID ${id} has been deleted.` };
  } catch (error) {
    console.error('Error deleting employee:', error.message);
    throw error;
  }
}

app.post('/employees/delete', async (req, res) => {
  try {
    const { id } = req.body;

    // Validate that ID is provided
    if (!id) {
      return res.status(400).json({
        message: 'Employee ID is required to delete an employee.',
      });
    }

    const response = await deleteEmployeeById(id);
    return res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//---------------------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
