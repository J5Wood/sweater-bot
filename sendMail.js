import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "reveranddr.doom@gmail.com",
    pass: "wevgegwarwctxlzq",
  },
});

const mailOptions = {
  from: "reveranddr.doom@gmail.com",
  to: "ithinktheylike.wood@gmail.com",
  subject: "ALERT",
  text: "IT'S TIME!",
};

transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.log(error);
  } else {
    console.log("Emai sent " + info.response);
  }
});
