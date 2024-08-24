import nodemailer from 'nodemailer';

export const sentMail = async (from: string, toMail: string, pass: string, content: string) => {
  // Create a transporter object using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or another service like 'smtp', 'yahoo', etc.
    auth: {
      user: from,
      pass: 'fizr jlnv zkmo mudb'
    }
  });

  // Define email options
  const mailOptions = {
    from: from,
    to: toMail,
    subject: 'Subject of your email',
    text: `Pass word :  ${content}`
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
