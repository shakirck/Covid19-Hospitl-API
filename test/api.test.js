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
let token;
let patientID;
const doctorDetails = {
  username: 'testdoctor',
  password: 'test',
  name: 'Test Doctor',
};
const PatientDetails = {
  mob: 'testPatient',
  name: 'Test Patient',
};
const doctorLogin = {
  username: 'testdoctor',
  password: 'test',
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
  it('Login a Doctor', (done) => {
    chai
      .request(app)
      .post('/api/doctors/login')
      .type('form')
      .send(doctorLogin)
      .end((err, res) => {
        console.log(res.body);
        token = res.body.token;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('token');
        expect(res.body.token).to.be.an('string').with.length.above(1);
        done();
      });
  });
  it('Register a New Patient', (done) => {
    chai
      .request(app)
      .post('/api/patients/register')
      .set('Authorization', 'Bearer ' + token)
      .type('form')
      .send(PatientDetails)
      .end((err, res) => {
        console.log(res.body);
        id = res.body.id;
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('id');
        done();
      });
  });
  it('Register  Already Present Patient', (done) => {
    chai
      .request(app)
      .post('/api/patients/register')
      .set('Authorization', 'Bearer ' + token)
      .type('form')
      .send(PatientDetails)
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('INFO');
        expect(res.body.INFO.reports).to.be.an('array');
        expect(res.body.INFO.name).to.be.equals(PatientDetails.name);
        done();
      });
  });
  // it('Create a Report for a  patient', (done) => {
  //   chai
  //     .request(app)
  //     .post('/api/:id/create_report')
  //     .set('Authorization', 'Bearer ' + token)
  //     .type('form')
  //     .send(PatientDetails)
  //     .end((err, res) => {
  //       console.log(res.body);
  //       expect(res).to.have.status(200);

  //       done();
  //     });
  // });
  it('Get all Report Of a Patient');
});

describe('Patient', (done) => {
  it('Create a Report for a  patient');
  it('Get all Report Of a Patient');
});

describe('Report', (done) => {
  it('Get all Report Of a Patients having a specific status');
});
