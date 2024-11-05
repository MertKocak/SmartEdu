const nodemailer = require("nodemailer");
const Course = require("../models/Course");
const User = require("../models/User");

exports.getAboutPage = (req, res) => {
  res.status(200).render("about", {
    page_name: "about",
  });
};

exports.getCoursesPage = (req, res) => {
  res.status(200).render("courses", {
    page_name: "courses",
  });
};

exports.getIndexPage = async (req, res) => {
  const courses = await Course.find().sort("-date").limit(2).populate("user");
  const totalCourses = await Course.find().countDocuments();
  const totalStudents = await User.find().countDocuments({ role: "Student" });
  const totalTeachers = await User.find().countDocuments({ role: "Teacher" });

  res.status(200).render("index", {
    page_name: "index",
    courses,
    totalCourses,
    totalStudents,
    totalTeachers,
  });
};

exports.getRegisterPage = (req, res) => {
  res.status(200).render("register", {
    page_name: "register",
  });
};

exports.getLoginPage = (req, res) => {
  res.status(200).render("login", {
    page_name: "login",
  });
};

exports.getContactPage = (req, res) => {
  res.status(200).render("contact", {
    page_name: "contact",
  });
};

exports.sendEmail = async (req, res) => {
  try {
    const outputMessage = `
  <h1>Mail Detail</h1>
    <ul>
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
  <h2>Message:</h2>
  <p>${req.body.message}</p>
  `;
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for port 465, false for other ports
      auth: {
        user: "mertkocak.2811@gmail.com",
        pass: "ikhtkvlzqvczciyq",
      },
    });
    const info = await transporter.sendMail({
      from: '"SmartEdu" <mertkocak.2811@gmail.com>',
      to: "mertkocak.2811@gmail.com",
      subject: "SmartEdu New Message",
      html: outputMessage,
    });
    console.log("Message sent: %s", info.messageId);

    req.flash("success", "We received your message successfully!");

    res.status(200).redirect("contact");
  } catch (err) {
    req.flash("error", "something happened :(");
    res.status(200).redirect("contact");
  }
};
