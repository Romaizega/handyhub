const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
})

const sendVerificationEmail = async (email, code) => {
  await transporter.sendMail({
    from: `"HandyHub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your HandyHub account',
    html:`
      <h2>Welcome to HandyHub</h2>
      <p>Your verification code is:</p>
      <h1>${code}</h1>
      <p>Code expires in minutes.</p> 
    `
  })
}

module.exports = {sendVerificationEmail}