const mongoose = require('mongoose');

const contactScheama = mongoose.Schema({
    admin_id :  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    user_id : { type: 'ObjectId', ref: 'User' },
    room : {type:String,required:true},
    status : {type:String,default:1}
})

module.exports= mongoose.model('Contact',contactScheama)