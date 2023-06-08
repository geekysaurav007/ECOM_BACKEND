const express=require('express')
const {getUsers,saveUsers,loginUser,updateUser,updateuserById}=require('../controller/user-controller')
const {getOrdersofUser}=require("../controller/order-controller")
const  {userAuthMiddleware,adminAuthMiddleware}  = require('../middlewares/user-auth-middleware')
const userRouter=express.Router()
//........> /api/users pe get request
userRouter.get('',getUsers)
//.........> /api/users pe post request(for sign up)
userRouter.post('',saveUsers)
// .......> /api/users/login......used to login a user
userRouter.post('/login',loginUser)
//------> /api/users pe put request update krne ke liye//middleware->userauth or not
userRouter.put("/",userAuthMiddleware,updateUser)
// -------> api/users/id pe put jab wo ek admin ho
userRouter.put('/:id',adminAuthMiddleware,updateuserById)
// -----> /api/users/1223445/orders
userRouter.get('/:id/orders',getOrdersofUser)

module.exports={userRouter}