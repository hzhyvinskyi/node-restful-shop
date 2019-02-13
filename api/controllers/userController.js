// Load User Model
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.index = (req, res) => {
    User.find()
        .select('id name email password createdAt updatedAt')
        .exec((err, users) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            } else {
                res.status(200).json({
                    count: users.length,
                    users: users.map(user => {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            password: user.password,
                            registered: user.createdAt,
                            updated: user.updatedAt
                        }
                    })
                });
            }
        });
};

exports.show = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            res.status(404).json({
                ...err
            });
        } else {
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                password: user.password,
                registered: user.createdAt,
                updated: user.updatedAt
            });
        }
    });
};

exports.login = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            res.status(404).json({
                ...err
            });
        }
        if(!user) {
            res.status(401).json({
                error: {
                    message: 'Auth failed'
                }
            });
        } else {
            bcryptjs.compare(req.body.password, user.password, (err, result) => {
                if(err) {
                    res.status(401).json({
                        error: {
                            message: 'Auth failed'
                        }
                    });
                }
                if(result) {
                    jwt.sign(
                        {
                            email: user.email,
                            id: user.id
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: '12h'
                        },
                        (err, token) => {
                            if(err) {
                                res.status(401).json({
                                    message: 'Auth failed'
                                });
                            }
                            if(token) {
                                res.status(404).json({
                                    message: 'Auth successful',
                                    token: token
                                });
                            } else {
                                res.status(401).json({
                                    error: {
                                        message: 'Auth failed'
                                    }
                                });
                            }
                        }
                    );
                } else {
                    res.status(401).json({
                        error: {
                            message: 'Auth failed'
                        }
                    });
                }
            });
        }
    });
};

exports.register = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            res.status(404).json({
                ...err
            });
        }
        if(user) {
            res.status(409).json({
                error: {
                    message: 'Email already exists'
                }
            });
        } else if (req.body.password.length < 8) {
            res.status(400).json({
                error: {
                    message: 'Password must contain at least 8 characters'
                }
            });
        } else {
            bcryptjs.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(422).json({
                        ...err
                    });
                }
                if(hash) {
                    new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }).save(err => {
                        if(err) {
                            res.status(404).json({
                                ...err
                            });
                        } else {
                            res.status(201).json({
                                message: 'Registration was successful. Now you can login: '
                                    + req.protocol + '://' + req.get('host') + '/users/login'
                            });
                        }
                    });
                } else {
                    res.status(422).json({
                        ...err
                    });
                }
            });
        }
    });
};

exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id, err => {
        if(err) {
            res.status(404).json({
                ...err
            });
        } else {
            res.status(200).json({
                message: 'User deleted successfully'
            });
        }
    });
};