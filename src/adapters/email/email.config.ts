import nodemailer from "nodemailer";

require("dotenv").config();

// Create a transporter using SMTP
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g., smtp.gmail.com or your SMTP provider
  port: Number(process.env.SMTP_PORT) || 587, // 465 for SSL, 587 for TLS
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // your email
    pass: process.env.SMTP_PASS, // your email password or app password
  },
    tls: {
    rejectUnauthorized: false, // ✅ ignore self-signed certificates
  },
});
