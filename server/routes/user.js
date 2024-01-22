const router = require("express").Router();
const bcrypt = require("bcrypt");
const user = require("../models/user.model");
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  user
    .find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("error : " + err));
});

router.route("/add").post(async (req, res) => {
  try {
    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = await bcrypt.hash(req.body.password, 10);

    const doc = await user.findOne({ email }).exec();
    if (doc) {
      return res.status(400).send({ message: "Account already exists!" });
    }

    const newuser = new user({ name, email, password });
    newuser
      .save()
      .then(() => res.send("user added!"))
      .catch((err) => res.status(400).json("error : " + err));
  } catch (err) {
    return res
      .status(400)
      .send({ message: "Something went wrong! Please try again" });
  }
});

router.route("/login").post(async (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  const doc = await user.findOne({ email }).exec();
  if (!doc) {
    return res.status(400).send({ message: "Account does not exist!" });
  }

  const passwordCheck = bcrypt.compareSync(password, doc.password);
  if (!passwordCheck) {
    return res.status(400).send({ message: "Incorrect password!" });
  } else {
    const token = jwt.sign(
      { id: doc._id, email: doc.email },
      // process.env.ACCESS_TOKEN_SECRET
      "a4f0783386f4a0d72e0d56edcdeedfa7ba2adf772ca07a980ccc44c967345c72"
    );
    res.setHeader("Access-Control-Expose-Headers", "*");
    res.setHeader("auth-token", token);
    return res.status(200).send({ name: doc.name });
  }
});

module.exports = router;
