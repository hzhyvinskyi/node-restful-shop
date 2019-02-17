process.env.NODE_ENV = 'test';

const app = require('../../app');
const Employee = require('../../api/models/employee/employee');
const User = require('../../api/models/user');

const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

chai.use(chaiHttp);

const employee = {
    name: 'test',
    active: 'true',
    sphere: 'test',
    rank: 'test',
    technologies: [
        'test',
        'test'
    ]
};
const user = {
    name: 'test',
    email: 'test@test.com',
    password: 'testZ345test-'
}

describe('Emlpoyees', () => {
    beforeEach(done => {
        Employee.remove({}, err => {
            User.remove({}, err => {
                done();
            });
        });
    });
    describe('GET employees', () => {
        it('Should get employees list', done => {
            chai.request(app).
            get('/employees').
            end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.count.should.be.eql(0);
                res.body.employees.should.be.a('array');
                res.body.employees.length.should.be.eql(0);
                Object.keys(res.body).length.should.be.eql(2);
                res.body.should.have.property('count');
                res.body.should.have.property('employees');
                done();
            });
        });
    });
    describe('GET/:id employee', () => {
        it('Should get employee by the given id', done => {
            chai.request(app).
            post('/users/register').
            send(user).
            end((err, res) => {
                chai.request(app).
                post('/users/login').
                send({
                    email: user.email,
                    password: user.password
                }).
                end((err, res) => {
                    const token = res.body.token;
                    chai.request(app).
                    post('/employees').
                    set('Authorization', 'Bearer ' + token).
                    send(employee).
                    end((err, res) => {
                        chai.request(app).
                        get('/employees/' + res.body.employee.id).
                        end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('id');
                            res.body.should.have.property('name').eql(employee.name);
                            res.body.should.have.property('avatar');
                            res.body.should.have.property('active');
                            res.body.active.should.be.a('boolean');
                            res.body.department.should.be.a('array');
                            res.body.position.should.be.a('array');
                            res.body.skills.should.be.a('array');
                            res.body.department[0].should.have.property('sphere').eql(employee.sphere);
                            res.body.position[0].should.have.property('rank').eql(employee.rank);
                            res.body.skills[0].should.have.property('technologies').eql(employee.technologies);
                            done();
                        });
                    });
                });
            });
        });
    });
    describe('POST employee', () => {
        it('Shouldn\'t store employee without name', done => {
            chai.request(app).
            post('/users/register').
            send(user).
            end((err, res) => {
                chai.request(app).
                post('/users/login').
                send({
                    email: user.email,
                    password: user.password
                }).
                end((err, res) => {
                    const token = res.body.token;
                    const {active, sphere, rank, technologies} = employee;
                    chai.request(app).
                    post('/employees').
                    set('Authorization', 'Bearer ' + token).
                    send(active, sphere, rank, technologies).
                    end((err, res) => {
                        res.should.have.status(400);
                        res.body.should.be.a('object');
                        res.body.should.have.property('error');
                        res.body.error.should.have.property('message');
                        done();
                    });
                });
            });
        });
        it('Should store employee', done => {
            chai.request(app).
            post('/users/register').
            send(user).
            end((err, res) => {
                chai.request(app).
                post('/users/login').
                send({
                    email: user.email,
                    password: user.password
                }).
                end((err, res) => {
                    const token = res.body.token;
                    chai.request(app).
                    post('/employees').
                    set('Authorization', 'Bearer ' + token).
                    send(employee).
                    end((err, res) => {
                        res.should.have.status(201);
                        res.body.should.be.a('object');
                        res.body.should.have.property('message').eql('Employee created successfully');
                        res.body.should.have.property('employee');
                        res.body.employee.should.have.property('id');
                        res.body.employee.should.have.property('name');
                        res.body.employee.should.have.property('avatar');
                        res.body.employee.should.have.property('active');
                        res.body.employee.should.have.property('department');
                        res.body.employee.should.have.property('position');
                        res.body.employee.should.have.property('skills');
                        res.body.employee.department[0].should.have.property('sphere');
                        res.body.employee.position[0].should.have.property('rank');
                        res.body.employee.skills[0].should.have.property('technologies');
                        done();
                    });
                });
            });
        });
    });
    describe('PUT/:id employee', () => {
        it('Should update employee by the given id', done => {
            chai.request(app).
            post('/users/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                post('/users/login').
                send({
                    email: user.email,
                    password: user.password
                }).
                end((err, res) => {
                    const token = res.body.token;
                    chai.request(app).
                    post('/employees').
                    set('Authorization', 'Bearer ' + token).
                    send(employee).
                    end((err, res) => {
                        chai.request(app).
                        put('/employees/' + res.body.employee.id).
                        set('Authorization', 'Bearer ' + token).
                        send({
                            name: 'updated',
                            active: 'false',
                            sphere: 'test',
                            rank: 'test',
                            technologies: [
                                'test'
                            ]
                        }).
                        end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.a('object');
                            res.body.should.have.property('message').eql('Employee updated successfully');
                            res.body.should.have.property('employee');
                            res.body.employee.should.have.property('id');
                            res.body.employee.should.have.property('name').eql('updated');
                            res.body.employee.should.have.property('avatar');
                            res.body.employee.should.have.property('active');
                            res.body.employee.active.should.not.eql(employee.active);
                            res.body.employee.should.have.property('department');
                            res.body.employee.should.have.property('position');
                            res.body.employee.should.have.property('skills');
                            res.body.employee.department.should.have.property('sphere').eql(employee.sphere);
                            res.body.employee.position.should.have.property('rank').eql(employee.rank);
                            res.body.employee.skills.should.have.property('technologies').not.eql(employee.technologies);
                            done();
                        });
                    });
                });
            });
        });
    });
    describe('DELETE/:id employee', () => {
        it('Should delete employee by the given id', done => {
            chai.request(app).
            post('/users/register').
            send(user).
            end((err, res) => {
                res.should.have.status(201);
                res.body.should.be.a('object');
                Object.keys(res.body).length.should.eql(1);
                res.body.should.have.property('message');
                chai.request(app).
                post('/users/login').
                send({
                    email: user.email,
                    password: user.password
                }).
                end((err, res) => {
                    const token = res.body.token;
                    chai.request(app).
                    post('/employees').
                    set('Authorization', 'Bearer ' + token).
                    send(employee).
                    end((err, res) => {
                        chai.request(app).
                        delete('/employees/' + res.body.employee.id).
                        set('Authorization', 'Bearer ' + token).
                        end((err, res) => {
                            res.should.have.status(200);
                            res.should.be.a('object');
                            res.body.should.have.property('message').eql('Employee deleted successfully');
                            done();
                        });
                    });
                });
            });
        });
    });
});