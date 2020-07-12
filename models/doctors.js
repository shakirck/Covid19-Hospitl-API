const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    patientsTreated:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Patient'
        }
    ]
})

const Doctor = mongoose.model('Doctor',doctorSchema);
module.exports = Doctor;