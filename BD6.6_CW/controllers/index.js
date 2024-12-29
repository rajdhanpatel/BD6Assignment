let employees = [
  {
    employeeId: 1,
    name: 'Rahul Sharma',
    emial: 'rahul.sharma@example.com',
    departmentId: 1,
    roleId: 1,
  },
  {
    employeeId: 2,
    name: 'Priya Singh',
    emial: 'priya.singh@example.com',
    departmentId: 2,
    roleId: 2,
  },
  {
    employeeId: 3,
    name: 'Ankit Verma',
    emial: 'ankit.verma@example.com',
    departmentId: 1,
    roleId: 3,
  },
];

function getAllEmployees() {
  return employees;
}
function getEmployeeById(id) {
  return employees.find((employee) => employee.employeeId === id);
}

module.exports = { getAllEmployees, getEmployeeById };
