import dotenv from "dotenv";
import nodemailer from "nodemailer";
import ejs from "ejs";
import { fileURLToPath } from "url";
import path from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const sendMail = async (options) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_GMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const { email, subject, template, data } = options;

  // get the pdath to the email template file
  const templatePath = path.join(__dirname, "../mails", template);

  // Render the email template with EJS
  const html = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: process.env.MAIL_GMAIL,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
