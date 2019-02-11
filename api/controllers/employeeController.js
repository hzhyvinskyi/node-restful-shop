// Load Product Model
const Employee = require('../models/employee');

// Employee list
exports.index = (req, res) => {
    Employee.find()
        .select('id name avatar active department position skills')
        .exec((err, employees) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            } else {
                res.status(200).json({
                    count: employees.length,
                    employees: employees.map(employee => {
                        return {
                            id: employee.id,
                            name: employee.name,
                            avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
                            active: employee.active,
                            department: employee.department,
                            position: employee.position,
                            skills: employee.skills,
                            request: {
                                method: 'GET',
                                url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + employee.id
                            }
                        }
                    })
                });
            }
        });
};

// Employee Details
exports.show = (req, res) => {
    Employee.findById(req.params.id)
        .select('id name avatar active department position skills')
        .exec((err, employee) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            } else {
                res.status(200).json({
                    id: employee.id,
                    name: employee.name,
                    avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
                    active: employee.active,
                    department: employee.department,
                    position: employee.position,
                    skills: employee.skills
                });
            }
        });
};

// Employee Save
exports.store = (req, res) => {
    const employee = {
        id: req.body.id,
        name: req.body.name,
        avatar: req.file.path,
        active: req.body.active,
        department: req.body.department,
        position: req.body.position,
        skills: req.body.skills
    };

    new Employee(employee).save((err, item) => {
        if(err) {
            res.status(404).json({
                ...err
            });
        } else {
            res.status(201).json({
                message: 'Employee created successfully',
                employee: {
                    id: item.id,
                    name: item.name,
                    avatar: item.avatar ? req.protocol + '://' + req.get('host') + '/' + item.avatar : null,
                    active: item.active,
                    department: item.department,
                    position: item.position,
                    skills: item.skills,
                    request: {
                        method: 'GET',
                        url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + item.id
                    }
                }
            });
        }
    });
};

// Employee Update
exports.update = (req, res) => {
    Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err, employee) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            } else {
                res.status(200).json({
                    message: 'Employee updated successfully',
                    employee: {
                        id: employee.id,
                        name: req.body.name || employee.name,
                        avatar: req.body.avatar || employee.avatar,
                        active: req.body.active || employee.active,
                        department: req.body.department || employee.department,
                        position: req.body.position || employee.position,
                        skills: req.body.skills || employee.skills,
                        request: {
                            method: 'GET',
                            url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + employee.id
                        }
                    }
                });
            }
        }
    );
}

// Employee Delete
exports.destroy = (req, res) => {
    Employee.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.status(404).json({
                ...err
            });
        } else {
            res.status(200).json({
                message: 'Employee deleted successfully'
            });
        }
    });
};