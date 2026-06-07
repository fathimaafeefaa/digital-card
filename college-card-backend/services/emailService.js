const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: `"EAU Digital Card" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your EAU Digital Card Login Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
        <div style="background: #1a3a5c; padding: 24px; text-align: center;">
          <h1 style="color: #c8a84b; margin: 0; font-size: 20px;">Emirates Aviation University</h1>
          <p style="color: #ffffff; margin: 4px 0 0; font-size: 13px;">Digital Student Card</p>
        </div>
        <div style="background: #f9f9f9; padding: 32px; text-align: center;">
          <p style="color: #333; font-size: 15px; margin-bottom: 8px;">Your login verification code is:</p>
          <div style="background: #1a3a5c; color: #c8a84b; font-size: 36px; font-weight: bold; letter-spacing: 12px; padding: 20px; border-radius: 12px; margin: 16px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 13px;">This code expires in <strong>10 minutes</strong>.</p>
          <p style="color: #666; font-size: 13px;">If you did not request this, please ignore this email.</p>
        </div>
        <div style="background: #1a3a5c; padding: 16px; text-align: center;">
          <p style="color: #888; font-size: 11px; margin: 0;">© Emirates Aviation University — Digital Card System</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOTP };
