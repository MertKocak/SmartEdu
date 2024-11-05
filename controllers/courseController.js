const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const course = await Course.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      user: req.session.userID,
    });
    req.flash("success", "Course has been created successfully!");
    res.status(201).redirect("/courses");
  } catch (error) {
    req.flash("error", "Something happened :(");
    res.status(400).redirect("/courses");
  }
};

exports.getAllCourses = async (req, res) => {
  try {
    const categorySlug = req.query.categories;
    const category = await Category.findOne({ slug: categorySlug });

    const query = req.query.search;

    let filter = {};

    if (categorySlug) {
      filter = { category: category._id };
    }

    if (query) {
      filter = { title: query };
    }

    if (!query && !categorySlug) {
      (filter.title = ""), (filter.category = null);
    }

    const courses = await Course.find({
      $or: [
        { title: { $regex: ".*" + filter.title + ".*", $options: "i" } },
        { category: filter.category },
      ],
    })
      .sort("-date")
      .populate("user");
    const categories = await Category.find();

    res
      .status(200)
      .render("courses", { courses, categories, page_name: "courses" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug }).populate(
      "user"
    );
    const user = await User.findById(req.session.userID);
    const categories = await Category.find();

    res
      .status(200)
      .render("course", { course, user, categories, page_name: "course" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.enrollCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.addToSet({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.releaseCourse = async (req, res) => {
  try {
    const user = await User.findById(req.session.userID);
    await user.courses.pull({ _id: req.body.course_id });
    await user.save();
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    await Course.findOneAndDelete({ slug: req.params.slug });
    req.flash("error", "Course has been deleted successfully!");
    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    course.title = req.body.title;
    course.description = req.body.description;
    course.category = req.body.category;
    course.save();

    res.status(200).redirect("/users/dashboard");
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error,
    });
  }
};
