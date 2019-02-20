// Load User Model
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.index = async (req, res) => {
    try {
        const users = await User.find().select('id name email password createdAt updatedAt');
        res.status(200).json({
            count: users.length,
            users: users.map(user => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    registered: user.createdAt,
                    updated: user.updatedAt
                }
            })
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
}

exports.show = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            registered: user.createdAt,
            updated: user.updatedAt
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        await bcryptjs.compare(req.body.password, user.password);
        const token = await jwt.sign({email: user.email, id: user.id}, process.env.JWT_KEY, {expiresIn: '12h'});
        res.status(200).json({
            message: 'Auth successful',
            token: token
        });
    } catch(err) {
        res.status(401).json({
            error: {
                message: 'Auth failed'
            }
        });
    }
};

exports.register = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(user) {
            res.status(409).json({
                error: {
                    message: 'Email already exists'
                }
            });
        } else if(req.body.password.length < 8) {
            res.status(400).json({
                error: {
                    message: 'Password must contain at least 8 characters'
                }
            });
        }
        const hash = await bcryptjs.hash(req.body.password, 10);
        const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash
        });
        await newUser.save();
        res.status(201).json({
            message: 'Registration was successful. Now you can login: '
                + req.protocol + '://' + req.get('host') + '/users/login'
        });
    } catch(err) {
        res.status(400).json({
            error: {
                message: err.message
            }
        });
    }
};

exports.delete = async (req, res) => {
    try {
        await User.findByIdAndRemove(req.params.id);
        res.status(200).json({
            message: 'User deleted successfully'
        });
    } catch(err) {
        res.status(404).json({
            error: {
                message: err.message
            }
        });
    }
};