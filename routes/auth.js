const express = require("express");
const { User } = require("../model/users");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const config = require("config");

class Auth {
  constructor() {
    this.router = express.Router();
    this.postRoutes();
  }

  postRoutes() {
    this.router.post("/", async (req, res) => {
      try {
        const { error } = this.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const { name, password, emailId } = req.body;
        const userCheck = await User.findOne({emailId});
        if(!userCheck) {
            //we are not sending 404 as we dont want user to know whats is wrong for security
          return res.send("Invalid Email or password")
        }
        const isPasswordValid = await bcrypt.compare(password, userCheck.password);
        if(!isPasswordValid) {
          return res.send("Invalid Email or password")
        }
        const token = await jwt.sign({_id:userCheck._id}, config.get("JWT_SECRET"));
        res.cookie("token", token);
        return res.send(true);
      } catch (e) {
        return res.status(400).send("Error " + e?.message);
      }
    });
  }

   validate(user) {
    const schema = Joi.object({
      emailId: Joi.string().min(5).required(),
      password: Joi.string().required()
    }).unknown(true)
  
    return schema.validate(user);
  }
  
}
module.exports = new Auth().router;
