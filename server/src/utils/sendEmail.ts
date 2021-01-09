import nodemailer from 'nodemailer';

export const sendEmail = async (to: string, subject:string, html: string) => {

  let transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'dw7oamnkq2qqtnh6@ethereal.email',
      pass: 'BX6dmx1z8VQ3gtbdHT',
    },
  });

  let info = await transporter.sendMail({
    from: '"Muneddit" <hello@muneddit.com>',
    to,
    subject,
    html,
  });

  console.log('Message sent: %s', info.messageId);

  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
};
