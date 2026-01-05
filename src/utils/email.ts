import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import handlebars from "handlebars";

dotenv.config();

interface Options {
  email: string;
  subject: string;
  templateData: Record<string, string | number>;
}

const sendEmail = async (options: Options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.BREVO_SMTP_HOST,
    port: Number(process.env.BREVO_SMTP_PORT),
    secure: false,
    auth: {
      user: process.env.BREVO_SMTP_USER,
      pass: process.env.BREVO_SMTP_PASS,
    },
  });

  await transporter.verify();

  const __dirname = path.resolve();

  const templatePath = path.join(
    __dirname,
    "template",
    "bookingTemplate.html"
  );

  const templateSource = fs.readFileSync(templatePath, "utf8");
  const template = handlebars.compile(templateSource);

  const htmlContent = template(options.templateData);

  await transporter.sendMail({
    from: `"DriveEase" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: htmlContent,
  });

  console.log("✅ Email sent successfully");
};

export default sendEmail;
