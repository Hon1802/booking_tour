import nodemailer from 'nodemailer';
import currentConfig from '../config';

export const sentAcceptMail = async (from: string, toMail: string, content: string,subject:string ) => {
  // Create a transporter object using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service like 'smtp', 'yahoo', etc.
    auth: {
      user: from,
      pass: currentConfig.app.pass_app_email
    },
    tls: {
      rejectUnauthorized: false, // Bỏ qua kiểm tra chứng chỉ (dùng cho phát triển)
    }
  });

  // Define email options
  const mailOptions = {
    from: from,
    to: toMail,
    subject: subject,
    html:  content, // if you want to send HTML email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
export const sentOTPMail = async (from: string, toMail: string, pass: string, content: string,subject:string ) => {
  // Create a transporter object using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service like 'smtp', 'yahoo', etc.
    auth: {
      user: from,
      pass: currentConfig.app.pass_app_email
    }
  });

  // Define email options
  const mailOptions = {
    from: from,
    to: toMail,
    subject: subject,
    text: `OTP:  ${content}`
    // html: '<p>Hello, this is the body of your email!</p>', // if you want to send HTML email
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};
