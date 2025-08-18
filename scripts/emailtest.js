const axios = require("axios");

async function sendEmail() {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { name: "Your Name", email: "pranabpiitk@gmail.com" },
        to: [{ email: "pranabpiitk2024@gmail.com", name: "Recipient Name" }],
        subject: "Hello from Brevo and Node.js",
        htmlContent: "<h1>This is a test email</h1><p>Sent via Brevo API</p>",
      },
      {
        headers: {
          "api-key": "cQgEG9fISybCmDZz", // store in .env
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error("Error sending email:", error.response?.data || error.message);
  }
}

sendEmail();
