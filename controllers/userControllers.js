// const { hashPassword } = require("../helpers/hashPassword");
const { hashPassword, comparePassword } = require("../helpers/authHelper");
const UserModel = require("../models/userModel");
const JWT = require("jsonwebtoken");

// REGISTER
const userRegisterController = async (req, res) => {
  try {
    const { username, email, password, answer } = req.body;
    // VALIDATION
    switch (true) {
      case !username:
        return res.send({ success: false, message: "Username is required" });
      case !email:
        return res.send({ success: false, message: "Email is required" });
      case !password || password?.length < 6:
        return res.send({ success: false, message: "Password is required and atleast 6 characters long", });
      case !answer:
        return res.send({ success: false, message: "Favorite-color is required",});
    }
    // CHECK EXISTING USER
    const isUserUsernameExist = await UserModel.findOne({ username });
    const isUserEmailExist = await UserModel.findOne({ email });
    if (isUserEmailExist) {
      return res.send({
        success: false,
        message: "This email is exist, try by other email",
      });
    }else if(isUserUsernameExist){
      return res.send({
        success: false,
        message: "This username is exist, try by other username",
      });
    }
    // REGISTER USER
    // hash password
    const hashedPassword = await hashPassword(password);
    // save user
    const user = await new UserModel({ username, email, password: hashedPassword, answer,}).save();
    return res.send({ success: true, message: "User registered successfully, please login", user, });
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error while registering a user",
      error,
    });
  }
};

// LOGIN
const userLoginController = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // VALIDATION
    switch (true) {
      case !email && !username:
        return res.send({ success: false, message: "Username or email is required",});
      case !password:
        return res.send({ success: false, message: "Password is required" });
    }
    // FIND USER
    const userByUsername = await UserModel.findOne({ username });
    const userByEmail = await UserModel.findOne({ email });
    if (!userByUsername && !userByEmail) {
      return res.send({ success: false,message: "Wrong username/email or password!", });
    }else if (userByUsername) {
      // COMPARE PASSWORD
      const passOk = await comparePassword(password, userByUsername?.password);
      if (!passOk) {
        return res.send({success: false, message: "Wrong email or password!",});
      }
      // TOKEN GENERATION
      const token = await JWT.sign({ _id: userByUsername._id },  process.env.JWT_SECRET, { expiresIn: "7d" });
      // undefined password
      userByUsername.password = undefined;
      const user = userByUsername;
      return res.send({
        success: true, 
        message: "Login successfully!", 
        user,
        token,});
    }else if (userByEmail) {
      // COMPARE PASSWORD
      const passOk = await comparePassword(password, userByEmail?.password);
      if (!passOk) {
        return res.send({ success: false, message: "Wrong email or password!",});
      }
      // TOKEN GENERATION
      const token = await JWT.sign({ _id: userByEmail._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
      // undefined password
      userByEmail.password = undefined;
      const user = userByEmail;
      return res.send({
        success: true, 
        message: "Login successfully!", 
        user,
        token,});
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error while login",
    });
  }
};

// CHECK THE USER
const checkUserController= async(req, res)=>{
  try {
    const { email, answer } = req.body
    // VALIDATION
    switch (true) {
      case !email:
        return res.send({ success: false, message: "Email is required",});
      case !answer:
        return res.send({ success: false, message: "Answer is required",});
    }
    // GET USER
    const user = await UserModel.findOne({email, answer})
    if(!user){
      return res.send({success: false, message: 'Wrong email or favorite color'})
    }
    // check user
    return res.send({success: true, message: 'Your email and password is matched!', user})
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error while reset password",
    });
  }
}

// RESET PASSWORD
const resetPasswordController= async(req, res)=>{
  try {
    const { _id, newPassword, confirmPassword } = req.body
    // VALIDATION
    switch (true) {
      case !newPassword:
        return res.send({ success: false, message: "New password is required" });
      case !comparePassword:
        return res.send({ success: false, message: "Confirm New password is required" });
    }
    // check data
    if(newPassword != confirmPassword){
      return res.send({success: false, message: 'The passwords you entered are not matched, please try again'})
    }
    // hash new password
    const hashedNewPassword = await hashPassword(newPassword)
    await UserModel.findOneAndUpdate({_id}, {password: hashedNewPassword}, {new: true})
    return res.send({success: true, message: 'Your password reseted successfully!'})
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error while reset password",
    });
  }
}

// UPDATE USER
const userUpdateController = async(req, res)=>{
  try {
    const {username, email, password} = req.body
    // find user
    const user = await UserModel.findOne({email})
    // password validation
    if(password && password.length < 6){
      return res.send({ success: false, message: 'Your password length must be atleast 6 character long'})
    }
    // hash password
    const hashedPassword = password ?  await hashPassword(password) : undefined;
    // update user
    const updatedUser = await UserModel.findOneAndUpdate({email}, {
      username: username ? username : user?.username,
      password: password ? hashedPassword : user?.password
    }, {new: true})
    // undefined password
    updatedUser.password = undefined;
    return res.send({ success: true, message: 'User updated successfully!', updatedUser}) 
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      message: "Error while  updating user",
    });
  }
}

// EXPORTS
module.exports = { userRegisterController, userLoginController, resetPasswordController, checkUserController, userUpdateController };
