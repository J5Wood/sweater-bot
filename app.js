import * as cheerio from "cheerio";
import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cron from "node-cron";
import nodemailer from "nodemailer";

const URL =
  "https://www.shopdisney.com/mickey-mouse-and-friends-disney100-pullover-hoodie-for-adults-disneyland-2140057390632M.html";
// const testURL =
//   "https://www.shopdisney.com/mickey-and-minnie-mouse-kristen-swing-dress-for-women-by-lilly-pulitzer-walt-disney-world-2140107140489M.html?isProductSearch=0&plpPosition=11&guestFacing=Clothing-Women-Dresses%2520%2526%2520Skirts";

const app = express();

app.get("/scrape", async (req, res, next) => {
  const answer = await getPage();
  return res.json({ result: answer });
});

app.listen(3003, function () {
  console.log(`Example app running on port ${this.address().port}`);
});

async function getPage() {
  try {
    const resp = await fetch(URL);
    const body = await resp.text();
    const $ = cheerio.load(body);
    const x = $("#add-to-cart")[0];
    if (x.attribs.disabled === "") {
      console.log("Still sold out 😥");
    } else {
      sendAlert()
    }
  } catch (error) {
    console.log(error);
  }
}

cron.schedule("*/30 * * * *", () => {
  fetch("http://localhost:3003/scrape");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILFROM,
    pass: process.env.EMAILPASSWORD,
  },
});

const mailOptions = {
  from: process.env.EMAILFROM,
  to: process.env.EMAILTO,
  subject: "ALERT",
  text: "IT'S TIME!",
};

function sendAlert() {
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent " + info.response);
    }
  })
}
