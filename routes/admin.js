const express = require("express");
const { loginUser, registerUser } = require("../controllers/authController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const Recipe = require("../models/recipe");
const router = express.Router();
const recipe = require("./recipe");
const User = require("../models/User");

router.get("/", async (req, res) => {
  let user = await User.find();
  let recipe = await Recipe.find().populate("createdBy", "name");
  let count = 0;
  user.forEach((usr) => {
    if (usr.status == "Pending") {
      count++;
    }
  });

  res.render("admin", {
    user,
    recipe,
    pending: count,
    approved: user.length - count,
  });
});
router.get("/details/:Id", async (req, res) => {
  const product = await Recipe.findById(req.params.Id)
    .populate("reviews.user", "name")
    .lean();

  const Id = req.params.id;

  //review
  let reviews = await Recipe.findById(req.params.Id).populate("reviews");
  product.reviews = reviews.reviews;
  let avgRating = 0;
  if (reviews.reviews.length > 0) {
    const totalRating = reviews.reviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    avgRating = totalRating / reviews.reviews.length;
  }
  product.avgRating = avgRating;

  res.render("adminView", { product, review: product.reviews });
});
router.get("/userDetails/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  res.render("viewUser", { user });
});

//ban User
router.post("/banUser/:Id", async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.Id,
    {
      status: "Banned",
    },
    {
      new: true,
    }
  );
  res.json({ success: true });
});

//Unban user
router.post("/unbanUser/:Id", async (req, res) => {
  await User.findByIdAndUpdate(
    req.params.Id,
    {
      status: "Approved",
    },
    {
      new: true,
    }
  );
  res.json({ success: true });
});

//delete User

router.post("/deleteUser/:Id", async (req, res) => {
  await User.findByIdAndDelete(req.params.Id, {
    new: true,
  });
  res.json({ success: true });
});
//Approve user
router.post("/approveUser", async (req, res) => {
  try {
    const { Id } = req.body;
    console.log(Id);
    const user = await User.findByIdAndUpdate(
      Id,
      { status: "Approved" },
      { new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

//delete Recipe

router.delete("/deleteRecipe/:Id", async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.Id);
  return res.redirect("/admin");
});

//delete Recipe

router.post("/deleteRecipe/:Id", async (req, res) => {
  await Recipe.findByIdAndDelete(req.params.Id, {
    new: true,
  });
  res.json({ success: true });
});

//Approve Recipe

module.exports = router;
