const { User } = require('../models/user')
const joi = require('joi')
const passHash = require('password-hash')
const jwt = require('jsonwebtoken')
const key=process.env.JWT_KEY
// fu8nction to get all users-------------------------------------->>>>>>
async function getUsers(req, resp, next) {
  const limit=Number.parseInt(req.query.limit)
  console.log(limit)
  const result=await User.find().limit(limit||10)
  return resp.json({result})
}
// ----------------------------------------------->>>>>>>>>>>>>>>>

// function to check login credentials--->
function validateLogincredentials(body) {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(6).max(10).required(),
  })
  const result = schema.validate(body)
  console.log("validate result is........>>>>", result)
  return result
}
// ------------------------------------------->

// function to save user-->>>>
async function saveUsers(req, resp, next) {
  const schema = joi.object({
    name: joi.string().min(4).required(),
    email: joi.string().email().required(),
    password: joi.string().min(6).max(10).required(),
    repassword: joi.string().min(6).max(10).required(),
    phone: joi.string().min(10).max(11)
  })
  const result = schema.validate(req.body)
  if (result.error) {
    // throw error
    return next(new Error(result.error.details[0].message))
  }
  const userData = req.body
  if (userData.password !== userData.repassword) {
    // throw error
    return next(new Error("password not matched"))
  }
  // user is unique or not
  let isExists = await User.isExists(userData.email)//isExixts is a method in User model
  if (!isExists) {
    userData.password = passHash.generate(userData.password)
    const user = await new User(userData).save()
    resp.json(user)

  } else {

    return next(new Error("email already exists"))
  }
}
// -------------------------------------------------------->

//function to Login user----------->>>>>>
async function loginUser(req, resp, next) {
  console.log(req.body)
  const result = validateLogincredentials(req.body)
  if (resp.err) {
    resp.status(400)
    const err = new Error(result.error.details[0].message)
    return next(err)
  }
  const { email, password } = result.value
  const user = await User.findOne({ email: email })
  console.log("user", user)
  if (user) {
    // password check
    ispasswordMatched = passHash.verify(password, user.password)
    if (ispasswordMatched) {
      // creating payload------->>>>
      const payload = {
        _id: user._id,
        isAdmin: user.isAdmin,
        email: user.email
      }
      // creating jwt token------->>>>>>
      const token = jwt.sign(payload,key )
      // const token consists of jwt value
      return resp.json({ message: "login success", token: token })
    }
  }
  resp.status(400)
  const err = new Error("Email or password invalid")
  return next(err)


  // resp.json({message:"login user"})
}
// ------------------------------------------------------>>>>>>>>>>>>>>

// function to update user by a USER------------------------------->
async function updateUser(req, resp, next) {
  const loggedInUser = req.session.userData //request me midddleware se payload bheje gaye
  console.log("logged in user is--->>>", loggedInUser)
  const schema = joi.object({  //sirf email or phone change kr skte
    phone: joi.string().min(10).max(11),
    name: joi.string().min(4).max(40)
  })

  const result_schema = schema.validate(req.body)// validate krke result_schema me store
  if (result_schema.error) { // agar error hai toh
    return next(new Error(result_schema.error.details[0].message))
  }

  //find kro and value set kro------>
  
  else {
    let user = await User.findById(loggedInUser._id)
    user = Object.assign(user, result_schema.value)
    user = await user.save() // user me assign krke save kiye
    console.log(user)
    return resp.json(user)
    
  }

}
// ------------------------------->>>>>>>>>>>>>

//  update by  admin-------------->>>>>>>>>>>>>>>
async function updateuserById(req, resp, next) {
  let userid = req.params.id //getting user id from params jo request bhej rhe
  let user = await User.findById(userid)
  user = Object.assign(user, req.body)
  user = await user.save() // user me assign krke save kiye
  resp.json(user)
  console.log(user)
}
// --------------------------------------------->>>>>>>>>


module.exports = { getUsers, saveUsers, loginUser, updateUser, updateuserById }

