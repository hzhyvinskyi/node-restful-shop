const mongoose = require('mongoose');

// Load Relative Model
const Employee = require('../models/employee/employee');
const Department = require('../models/employee/department');
const Position = require('../models/employee/position');
const Skill = require('../models/employee/skill');

// Employee List
exports.index = (req, res) => {
    Employee.
        find().
        populate('department.sphere position.rank skills.technologies').
        exec((err, employees) => {
            if(err) {
                res.status(404).json({
                    errors: {
                        message: err.message
                    }
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
                            departmentId: employee.department[0],
                            positionId: employee.position[0],
                            skillsId: employee.skills[0],
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
    Employee.
        findById(req.params.id).
        populate('department position skills').
        exec((err, employee) => {
            if(err) {
                res.status(404).json({
                    errors: {
                        message: err.message
                    }
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
    new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: req.file ? req.file.path : null,
        active: req.body.active
    }).save((err, employee) => {
        if(err) {
            res.status(400).json({
                error: {
                    message: err.message
                }
            });
        } else {
            const department = new Department({
                employee: employee._id,
                sphere: req.body.sphere
            });
            department.save(err => {
                if(err) {
                    res.status(400).json({
                        error: {
                            message: err.message
                        }
                    });
                } else {
                    const position = new Position({
                        employee: employee._id,
                        rank: req.body.rank
                    });
                    position.save(err => {
                        if(err) {
                            res.status(400).json({
                                error: {
                                    message: err.message
                                }
                            });
                        } else {
                            const skills = new Skill({
                                employee: employee._id,
                                technologies: req.body.technologies
                            });
                            skills.save(err => {
                                if(err) {
                                    res.status(400).json({
                                        error: {
                                            message: err.message
                                        }
                                    });
                                } else {
                                    employee.department.push(department);
                                    employee.position.push(position);
                                    employee.skills.push(skills);
                                    employee.save(err => {
                                        if(err) {
                                            res.status(400).json({
                                                errors: {
                                                    message: err.message
                                                }
                                            });
                                        } else {
                                            res.status(201).json({
                                                message: 'Employee created successfully',
                                                employee: {
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
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
};

// Employee Update
exports.update = (req, res) => {
    Employee.
        findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                avatar: req.file ? req.file.path : null,
                active: req.body.active
            },
            (err, employee) => {
                if(err) {
                    res.status(404).json({
                        errors: {
                            message: err.message
                        }
                    });
                } else {
                    Department.findOneAndUpdate(
                        {employee: employee.id},
                        {
                            $set: {
                                id: employee.department.id,
                                employee: employee.id,
                                sphere: req.body.sphere
                            }
                        },
                        (err, department) => {
                            if(err) {
                                res.status(404).json({
                                    errors: {
                                        message: err.message
                                    }
                                }); 
                            } else {
                                Position.findOneAndUpdate(
                                    {employee: employee.id},
                                    {$set: {
                                        id: employee.position.id,
                                        employee: employee.id,
                                        rank: req.body.rank
                                    }},
                                    (err, position) => {
                                        if(err) {
                                            res.status(404).json({
                                                errors: {
                                                    message: err.message
                                                }
                                            }); 
                                        } else {
                                            Skill.findOneAndUpdate(
                                                {employee: employee.id},
                                                {
                                                    $set: {
                                                        id: employee.skills.id,
                                                        employee: employee.id,
                                                        technologies: req.body.technologies
                                                    }
                                                },
                                                (err, skills) => {
                                                if(err) {
                                                    res.status(404).json({
                                                        errors: {
                                                            message: err.message
                                                        }
                                                    }); 
                                                } else {
                                                    res.status(200).json({
                                                        message: 'Employee updated successfully',
                                                        employee: {
                                                            id: req.params.id,
                                                            name: req.body.name || employee.name,
                                                            avatar: req.file ? req.file.path : employee.avatar,
                                                            active: req.body.active || employee.active,
                                                            department: {
                                                                id: department.id,
                                                                employeeId: department.employee,
                                                                sphere: department.sphere
                                                            } || employee.department,
                                                            position: {
                                                                id: position.id,
                                                                employeeId: position.employee,
                                                                rank: position.rank
                                                            } || employee.position,
                                                            skills: {
                                                                id: skills.id,
                                                                employeeId: employee.id,
                                                                technologies: req.body.technologies
                                                            } || employee.skills,
                                                            request: {
                                                                method: 'GET',
                                                                url: req.protocol + '://' + req.get('host') + req.baseUrl + '/' + employee.id
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            }
        );        
}

// Employee Delete
exports.destroy = (req, res) => {
    Employee.
        findById(req.params.id, (err, employee) => {
            if(err) {
                res.status(404).json({
                    errors: {
                        message: err.message
                    }
                });
            } else {
                Department.findOneAndDelete({employee: employee.id}, err => {
                    if(err) {
                        res.status(404).json({
                            errors: {
                                message: err.message
                            }
                        }); 
                    } else {
                        Position.findOneAndDelete({employee: employee.id}, err => {
                            if(err) {
                                res.status(404).json({
                                    errors: {
                                        message: err.message
                                    }
                                }); 
                            } else {
                                Skill.findOneAndDelete({employee: employee.id}, err => {
                                    if(err) {
                                        res.status(404).json({
                                            errors: {
                                                message: err.message
                                            }
                                        });
                                    } else {
                                        employee.remove()
                                        res.status(200).json({
                                            message: 'Employee deleted successfully'
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
};