const mongoose = require('mongoose');
const mailSender = require('../utils/mailSender');

const OtpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60,
    },
});

// send mail
// async function sendVaricationMail(email, otp){
//     try{
//         const mailResponse = mailSender(email, "This is the verification mail from the Dev&Innove, don't share otp with other", otp);
//         console.log("mail response -> ", mailResponse);
//     }
//     catch(error){
//         console.log("Error occured during sending mail", error);
//         throw error;
//     }
// }

// OtpSchema.pre('save', async function(next){
//     sendVaricationMail(this.mail, this.otp);
//     next();
// });

module.exports = mongoose.model("OTP", OtpSchema);