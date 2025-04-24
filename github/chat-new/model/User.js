const mongoose = require('mongoose');

const userScheama = mongoose.Schema({
    name : {type:String,required:true},
    email : {type:String,required:true},
    password:{type:String},
    password2:{type:String} , 
    image:{type:String},
},{ timestamps: true}
)
userScheama.path('name').get(function (v) {
    return v.toUpperCase() + ' is my name';
  });


module.exports= mongoose.model('User',userScheama)