const express = require("express");
const { User, validate } = require("../model/users");
const _ = require("lodash");
const bcrypt = require("bcrypt");

class Users {
  constructor() {
    this.router = express.Router();
    this.postRoutes();
  }

  postRoutes() {
    this.router.post("/", async (req, res) => {
      try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
        const { name, password, emailId } = req.body;
        const userCheck = await User.findOne({emailId});
        if(userCheck) {
          return res.status(400).send("User already there..")
        }
        const user = new User({
          name,
          password,
          emailId,
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        res.send(_.pick(user, ['name','emailId']));
      } catch (e) {
        return res.status(400).send("Error " + e?.message);
      }
    });
  }
}
module.exports = new Users().router;
