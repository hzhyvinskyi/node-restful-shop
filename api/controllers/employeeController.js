const mongoose = require('mongoose');
// Load Employee Model
const Employee = require('../models/employee/employee');
const Department = require('../models/employee/department');
const Position = require('../models/employee/position');
const Skill = require('../models/employee/skill');

// Employee List
exports.index = (req, res) => {
    Employee.
        find().
        populate('department.sphere position.rank skills.technology').
        exec((err, employees) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            }
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
                    ...err
                });
            }
            res.status(200).json({
                id: employee.id,
                name: employee.name,
                avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
                active: employee.active,
                department: employee.department,
                position: employee.position,
                skills: employee.skills
            });
        });
};

// Employee Save
exports.store = (req, res) => {
    const employee = new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: req.file.path,
        active: req.body.active
    });
    employee.save(err => {
        if(err) {
            res.status(404).json({
                ...err
            });
        }
        const department = new Department({
            employee: employee._id,
            sphere: req.body.sphere
        });
        department.save(err => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            }
            const position = new Position({
                employee: employee._id,
                rank: req.body.rank
            });
            position.save(err => {
                if(err) {
                    res.status(404).json({
                        ...err
                    });
                }
                const skill = new Skill({
                    employee: employee._id,
                    technology: req.body.technology
                });
                skill.save(err => {
                    if(err) {
                        res.status(404).json({
                            ...err
                        });
                    }
                    employee.department.push(department);
                    employee.position.push(position);
                    employee.skills.push(skill);
                    employee.save(err => {
                        if(err) {
                            res.status(404).json({
                                ...err
                            });
                        }
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
                    });
                });
            });
        });
    });
};

// Employee Update
exports.update = (req, res) => {
    Employee.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            avatar: req.file.path,
            active: req.body.active
        },
        (err, employee) => {
        if(err) {
            res.status(404).json({
                ...err
            });
        }
        Department.findOne({employee: employee.id}, (err, department) => {
            if(err) {
                res.status(404).json({
                    ...err
                }); 
            }
            department.update(req.body.sphere, err => {
                if(err) {
                    res.status(404).json({
                        ...err
                    }); 
                }
            });
        });
        Position.findOne({employee: employee.id}, (err, position) => {
            if(err) {
                res.status(404).json({
                    ...err
                }); 
            }
            position.update(req.body.position, err => {
                if(err) {
                    res.status(404).json({
                        ...err
                    }); 
                }
            });
        });
        Skill.find({id: employee.id}, (err, skills) => {
            if(err) {
                res.status(404).json({
                    ...err
                }); 
            }
            let i = 0;
            for(skill in skills) {
                skill.update(req.body.skill[i], err => {
                    if(err) {
                        res.status(404).json({
                            ...err
                        }); 
                    }
                });
                ++i;
            }
        });
        res.status(200).json({
            message: 'Employee updated successfully',
            employee: {
                id: req.params.id,
                name: req.body.name || employee.name,
                avatar: req.file.path || employee.avatar,
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
    });
}

// Employee Delete
exports.destroy = (req, res) => {
    Employee.
        findById(req.params.id, (err, employee) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            }
            Department.findOne({employee: employee.id}, (err, department) => {
                if(err) {
                    res.status(404).json({
                        ...err
                    }); 
                }
                department.remove(err => {
                    if(err) {
                        res.status(404).json({
                            ...err
                        }); 
                    }
                });
            });
            Position.findOne({employee: employee.id}, (err, position) => {
                if(err) {
                    res.status(404).json({
                        ...err
                    }); 
                }
                position.remove(err => {
                    if(err) {
                        res.status(404).json({
                            ...err
                        }); 
                    }
                });
            });
            Skill.find({id: employee.id}, (err, skills) => {
                if(err) {
                    res.status(404).json({
                        ...err
                    }); 
                }
                for(skill in skills) {
                    skill.remove(err => {
                        if(err) {
                            res.status(404).json({
                                ...err
                            }); 
                        }
                    });
                }
            });
            employee.remove(err => {
                if(err) {
                    res.status(404).json({
                        ...err
                    }); 
                }
                res.status(200).json({
                    message: 'Employee deleted successfully'
                });
            });
        });
};