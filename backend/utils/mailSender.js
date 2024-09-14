const nodeMailer = require('nodemailer'); // install nodemailer 

require('dotenv').config();

const mailSender = async (email, title, body) => {
    try{
        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }
        });
        let info = await transporter.sendMail({
            from:"Dev & Innove",
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`,
        })
        console.log("mail -> ", info);
        return info;
    }
    catch(error){
        console.log(error);
    }
}

module.exports = mailSender;