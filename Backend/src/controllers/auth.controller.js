require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");

const { body, validationResult } = require("express-validator");
const { errorFormat } = require("../utils/errorFormat");

const User = require("../models/user.model");
const router = express.Router();

const newToken = (user) => {
  return jwt.sign({ user: user }, process.env.JWT_SECRET_KEY);
};

router.post("/login", async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user)
      return res
        .status(400)
        .send({ message: "Either Email or Password is incorrect." });

    const match = user.checkPassword(req.body.password);

    if (!match)
      return res
        .status(400)
        .send({ message: "Either Email or Password is incorrect." });

    const token = newToken(user);

    return res.status(201).send({ user, token });
  } catch (err) {
    return res.status(500).send({ message: err.message });
  }
});

router.post(
  "/register",
  body("firstname")
    .isLength({ min: 3 })
    .withMessage("Firstname & Lastname are required, at least 3 characters."),
  body("lastname")
    .isLength({ min: 3 })
    .withMessage("Firstname & Lastname are required, at least 3 characters."),

  body("email").isEmail().withMessage("Please Enter valid email."),

  body("password")
    .notEmpty()
    .isLength({ min: 5 })
    .withMessage("Please enter at least 5 characters."),

  async (req, res) => {
    try {
      const error = validationResult(req);

      if (!error.isEmpty()) {
        return res.status(400).json({ error: errorFormat(error.array()) });
      }

      let user = await User.findOne({ email: req.body.email }).lean().exec();

      if (user)
        return res
          .status(400)
          .send({ userexists: "User with that email already exists." });

      user = await User.create(req.body);

      const token = newToken(user);

      return res.status(201).send({ user, token });
    } catch (err) {
      return res.status(500).send({ error: err.message });
    }
  }
);

router.get("/allUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
