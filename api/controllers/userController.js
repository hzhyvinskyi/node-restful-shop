// Load User Model
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.index = (req, res) => {
    User.
        find().
        select('id name email password createdAt updatedAt')
        .exec((err, users) => {
            if(err) {
                res.status(404).json({
                    error: {
                        message: err.message
                    }
                });
            } else {
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
            }
        });
};

exports.show = (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if(err) {
            res.status(400).json({
                error: {
                    message: err.message
                }
            });
        } else if(user) {
            res.status(200).json({
                id: user.id,
                name: user.name,
                email: user.email,
                registered: user.createdAt,
                updated: user.updatedAt
            });
        } else {
            res.status(404).json({
                error: {
                    message: 'Page Not Found'
                }
            });
        }
    });
};

exports.login = (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if(err) {
            res.status(404).json({
                error: {
                    message: err.message
                }
            });
        } else if(!user) {
            res.status(401).json({
                error: {
                    message: 'Auth failed'
                }
            });
        } else {
            bcryptjs.compare(req.body.password, user.password, (err, success) => {
                if(err) {
                    res.status(401).json({
                        error: {
                            message: 'Auth failed'
                        }
                    });
                } else if(success) {
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
                            } else if(token) {
                                res.status(200).json({
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
        } else if(user) {
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
        } else {
            bcryptjs.hash(req.body.password, 10, (err, hash) => {
                if(err) {
                    res.status(422).json({
                        error: {
                            message: err.message
                        }
                    });
                } else if(hash) {
                    new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    }).save(err => {
                        if(err) {
                            res.status(400).json({
                                error: {
                                    message: err.message
                                }
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
                        error: {
                            message: err.message
                        }
                    });
                }
            });
        }
    });
};

exports.update = (req, res) => {
    User.findByIdAndUpdate(
        req.params.id,
        req.body,
        (err, user) => {
            if(err) {
                res.status(404).json({
                    ...err
                });
            }
            if(user) {
                res.status(200).json({
                    message: 'User updated successfull',
                    user: {
                        id: user.id,
                        name: req.body.name || user.name,
                        email: req.body.email || user.email,
                        request: {
                            method: 'GET',
                            url: req.protocol + '://' + req.get('host') + '/users/' + user.id
                        }
                    }
                });
            }
        }
    );
}

exports.delete = (req, res) => {
    User.
        findByIdAndRemove(req.params.id, err => {
            if(err) {
                res.status(404).json({
                    error: {
                        message: err.message
                    }
                });
            } else {
                res.status(200).json({
                    message: 'User deleted successfully'
                });
            }
        });
};