const mongoose = require('mongoose');
 
const patientSchema = new mongoose.Schema({
    mob:{
        type:String,
        
    },
     name:{
         type:String,
      },
      
     reports:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Report'
        }
     ]
    
})

const Patient = mongoose.model('Patient',patientSchema);
module.exports = Patient;