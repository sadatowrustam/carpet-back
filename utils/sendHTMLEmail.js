require("dotenv").config({ path: "../config/config.env" });

const nodemailer = require("nodemailer");
const fs = require("fs");
const ejs = require("ejs");

module.exports = (htmlPath, data, subject, to, attachments) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Yandex",
      auth: {
        user: process.env.EMAIL_SENDER_ADDR,
        pass: process.env.EMAIL_SENDER_PASS,
      },
    });

    fs.readFile(htmlPath, "utf-8", async (err, html) => {
      if (err) throw new Error(err.message);

      html = ejs.render(html, { data });

      const mailOptions = {
        from: process.env.EMAIL_SENDER_ADDR,
        to,
        subject,
        html,
        attachments,
      };

      const res = await transporter.sendMail(mailOptions);

      console.log(res);
    });
  } catch (err) {
    console.log(err);
  }
};
