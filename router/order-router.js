const express=require('express')
const orderRouter=express.Router()
const {getOrders,placeOrder,deleteOrders,updateOrder}=require('../controller/order-controller')
const { userAuthMiddleware, adminAuthMiddleware } = require('../middlewares/user-auth-middleware')


// ----> /api/orders
orderRouter.get('',adminAuthMiddleware,getOrders)
orderRouter.post('',userAuthMiddleware,placeOrder)
orderRouter.delete('/:id',deleteOrders)
orderRouter.put("/:id",updateOrder)




module.exports={orderRouter}