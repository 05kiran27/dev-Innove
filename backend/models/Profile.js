const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    dateOfBirth:{
        type:String,
    },

    gender:{
        type:String,
    },

    contactNumber:{
        type:Number,
    },

    about:{
        type:String,
        trim:true,
    },

    post:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post",
    },
});

module.exports = mongoose.model('Profile', profileSchema);