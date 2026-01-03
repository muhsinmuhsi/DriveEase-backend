import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';

dotenv.config();

interface Options {
  email: string;
  subject: string;
  templateData: Record<string, string | number>; // Dynamic data for the template
}

const sendEmail = async (options: Options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Load and compile the template
  const templatePath = path.join(__dirname, 'template', 'bookingTemplate.html');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);

  // Inject data into the template
  const htmlContent = template(options.templateData);

  const mailOptions = {
    from: `"DRIVE EASE" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: htmlContent
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.response);
  } catch (err: any) {
    console.error('Error while sending email:', err);
    throw new Error('Failed to send email: ' + err.message);
  }
};

export default sendEmail;
