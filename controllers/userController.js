const User = require("../models/userModels");
const bcrypt = require("bcrypt");
const Joi = require("joi").extend(require("@joi/date"));
const jwt = require("jsonwebtoken");

// Validation UserData data, come from POST req.body
function validateUser(req) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email(),
    password: Joi.string().min(4).max(20).required(),
  });
  return schema.validate(req);
}

// Method for add new User
module.exports.addUser = async (req, res) => {
  try {
    const { error } = validateUser(req.body);
    if (error) {
      res.status(400).json({ message: error.message });
    } else {
      const { name, email, password } = req.body;
      const isUserAlreadyExist = await User.findOne({ email });
      if (isUserAlreadyExist) {
        res.status(200).json({ message: "This email is Already Exist !" });
      } else {
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
          name,
          email,
          password: hash,
        });

        if (user) {
          console.log("User Add Successfull");
          res.status(200).json({ message: "User Add Successfull", user });
        } else {
          res.status(400).json({ message: "Unsuccess" });
        }
      }
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Method for User login
module.exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      const match = await bcrypt.compare(password, checkUser.password);
      if (match) {
        const token = jwt.sign(
          {
            id: checkUser._id,
            email: checkUser?.email,
          },
          process.env.SecretKey,
          { expiresIn: "1d" }
        );

        res.status(200).json({ message: "Login Success", checkUser, token });
      } else {
        res.status(400).json({ message: "Password Is Wrong" });
      }
    } else {
      res.status(200).json({ message: "Email Not Register" });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Method for get User
module.exports.getUser = async (req, res) => {
  try {
    // let auditorid = req.token._id;
    const token = req.headers[process.env.ReqHeader];

    if (!token) {
      return res.status(401).json({ message: process.env.ReqHeader });
    } else {
      const decoded = jwt.verify(token, process.env.SecretKey);
      const email = decoded.email;
      const checkUser = await User.findOne({ email });
      if (checkUser) {
        res.status(200).json({ message: "Success", checkUser });
      }
    }
  } catch (error) {
    res.status(400).json({ message: error });
  }
};
