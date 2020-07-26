process.env.NODE_ENV = 'test';
const app = require('../index');
const mongoose = require('mongoose');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);

//models
const Doctor = require('../models/doctors');
const Patient = require('../models/patients');
const Report = require('../models/report');

const doctorDetails = {
  username: 'testdoctor',
  password: 'test',
  name: 'Test Doctor',
};
describe('Server Start / ', () => {
  beforeEach((done) => {
    Doctor.remove({}, (err) => {
      console.log('Successfully Deleted all contents in the DB');
      done();
    });
  });
  beforeEach((done) => {
    Patient.remove({}, (err) => {
      console.log('Successfully Deleted all contents in the DB');
      done();
    });
  });
  beforeEach((done) => {
    Report.remove({}, (err) => {
      console.log('Successfully Deleted all contents in the DB');
      done();
    });
  });

  it('Api welcome /api/', (done) => {
    chai
      .request(app)
      .get('/api/')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.message).to.equals('welcome');
        done();
      });
  });
});

describe('Doctor', (done) => {
  it('Create a new DOctor', (done) => {
    chai
      .request(app)
      .post('/api/doctors/register')
      .type('form')
      .send(doctorDetails)
      .end((err, res) => {
        console.log(res.body);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('Doctor').equals(doctorDetails.name);
        done();
      });
  });
  it('Login a Doctor');
  it('Register a Patien');
  it('Create a Report for a  patient');
  it('Get all Report Of a Patient');
});

describe('Patient', (done) => {
  it('Create a Report for a  patient');
  it('Get all Report Of a Patient');
});

describe('Report', (done) => {
  it('Get all Report Of a Patients having a specific status');
});
