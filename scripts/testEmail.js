const nodemailer = require("nodemailer");

async function sendEmail() {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // true for 465, false for 587
      auth: {
        user: "94f172001@smtp-brevo.com", 
        pass: "cQgEG9fISybCmDZz", // SMTP password
      },
    });

    let info = await transporter.sendMail({
      from: '"Pranab Paul" <pranabpiitk2024@gmail.com>',
      to: "pranabpiitk@gmail.com",
      subject: "Hello from Node.js and Brevo SMTP",
      html: "<h2>This is a test email</h2><p>Sent using Nodemailer + Brevo SMTP</p>",
    });

    console.log("Message sent:", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

sendEmail();
