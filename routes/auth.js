const express = require("express");
const { User } = require("../model/users");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const Joi = require("joi");

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
        const user = await User.findOne({emailId});
        if(!user) {
            //we are not sending 404 as we dont want user to know whats is wrong for security
          return res.send("Invalid Email or password")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
          return res.send("Invalid Email or password")
        }
        const token = await user.generateToken();
        // res.cookie("token", token);/
        res.header('x-auth-token',token);//for custom header prefix it with x-
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
