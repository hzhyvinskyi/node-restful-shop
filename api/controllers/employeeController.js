const mongoose = require('mongoose');

// Load Relative Model
const Employee = require('../models/employee/employee');
const Department = require('../models/employee/department');
const Position = require('../models/employee/position');
const Skill = require('../models/employee/skill');

// Employee List
exports.index = async (req, res) => {
    try {
        const employees = await Employee.find().populate('department position skills');
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
        })
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};

// Employee Details
exports.show = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id).populate('department position skills');
        res.status(200).json({
            id: employee.id,
            name: employee.name,
            avatar: employee.avatar ? req.protocol + '://' + req.get('host') + '/' + employee.avatar : null,
            active: employee.active,
            department: employee.department,
            position: employee.position,
            skills: employee.skills
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};

// Employee Save
exports.store = async (req, res) => {
    const employee =  new Employee({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        avatar: req.file ? req.file.path : null,
        active: !!Number(req.body.active)
    })
    const department = new Department({
        employee: employee._id,
        sphere: req.body.sphere
    });    
    const position = new Position({
        employee: employee._id,
        rank: req.body.rank
    });
    const skills = new Skill({
        employee: employee._id,
        technologies: req.body.technologies
    });
    try {
        employee.department.push(department);
        employee.position.push(position);
        employee.skills.push(skills);

        await employee.save();
        
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
    } catch(err) {
        res.status(400).json({
            error: {
                message: err.message
            }
        });
    }
};

// Employee Update
exports.update = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                avatar: req.file ? req.file.path : null,
                active: req.body.active
            }
        );
        const department = await Department.findOneAndUpdate(
            {
                employee: employee.id
            },
            {
                $set: {
                    id: employee.department.id,
                    employee: employee.id,
                    sphere: req.body.sphere
                }
            }
        );
        const position = await Position.findOneAndUpdate(
            {
                employee: employee.id
            },
            {
                $set: {
                    id: employee.position.id,
                    employee: employee.id,
                    rank: req.body.rank
                }
            }
        );
        const skills = await Skill.findOneAndUpdate(
            {
                employee: employee.id
            },
            {
                $set: {
                    id: employee.skills.id,
                    employee: employee.id,
                    technologies: req.body.technologies
                }
            }
        );
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
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

// Employee Delete
exports.destroy = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        await Department.findOneAndDelete({employee: employee.id});
        await Position.findOneAndDelete({employee: employee.id});
        await Skill.findOneAndDelete({employee: employee.id});

        if(employee.remove()) {
            res.status(200).json({
                message: 'Employee deleted successfully'
            });
        }
    } catch(err) {
        res.status(404).json({
            errors: {
                message: err.message
            }
        });
    }
};