const express = require("express");
const { User, validate } = require("../model/users");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const { auth } = require("../middleware/auth");

class Users {
  constructor() {
    this.router = express.Router();
    this.postRoutes();
    this.getRoutes();
  }

  getRoutes() {
    this.router.get("/me",auth,async(req,res)=>{
      try {
        const user = await User.findOne({_id:req.user._id}).select("-password");
        return res.send(user)
      } catch(e) {  
        return res.status(400).send("Error "+e?.message);
      }
    })
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
        const token = await user.generateToken();
        res.header('x-auth-token',token);//for custom header prefix it with x-
        // res.cookie("token", token);
        return res.send(_.pick(user, ['name','emailId']));
      } catch (e) {
        return res.status(400).send("Error " + e?.message);
      }
    });
  }
}
module.exports = new Users().router;
