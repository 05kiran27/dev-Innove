const nodeMailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    let transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER,   // Gmail address
        pass: process.env.MAIL_PASS,   // Gmail App Password
      },
    });

    let info = await transporter.sendMail({
      from: `"Dev & Innove" <${process.env.MAIL_USER}>`,
      to: email,
      subject: title,
      html: body,
    });

    console.log("✅ Mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.log("❌ Mail error:", error.message);
  }
};

module.exports = mailSender;
