const joi = require('joi')
const { Order } = require('../models/order')
const { Product } = require("../models/product")
const { status } = require('express/lib/response')
const { Error } = require('mongoose')
// function to get all orders----------------->>>>
async function getOrders(req, resp) {
    // const result=await Order.find().populate("user product")
    const result = await Order.find()
        .populate([
            { path: "product", populate: "category" },
            { path: "user", select: "email" }])
    resp.json({ result })
}
// ------------------------------------------------>>>>>>>>>>>>>>>>>
// function to validate order details
function validateOrder(data) {
    const schema = joi.object({
        orders: joi.array().items({
            product: joi.string().required(),
            user: joi.string().required(),
            address: joi.string().required(),
            quantity: joi.number().min(1).required()
        }).required().min(1)
    })
    const valid_res = schema.validate(data)
    return valid_res
}
// function to create orders--------------->>>>>>>
async function placeOrder(req, resp, next) {
    const valid_res = validateOrder(req.body)
    if (valid_res.error) {
        return next(new Error(valid_res.error.details[0].message))
    }
    result = valid_res.value.orders
    for (index in result) {
        let order = result[index]
        let productId = order.product
        let price = (await Product.findOne({ _id: productId })).price
        result[index].price = price
    }
    const final_result = await Order.create(result)
    resp.json({ orders: final_result })
}
// get all orders of a user by id----------------
async function getOrdersofUser(req, resp, next) {
    const user = req.params.id
    const result = await Order.find({ user }).populate("product")
    resp.json({ result })
}
// -------------------------------------------------------->
// ----------order delete krne ke liye--------->>>>>>
async function deleteOrders(req, resp, next) {
    const user = req.params.id
    const result = await Order.deleteOne({ _id: user })
    resp.json({ result })
}
// ----------------------------------------------------------------
// order update krne ke liye----------------------------------------->
async function updateOrder(req, resp, next) {
    const _id = req.params.id
    const body = req.body
    const schema = joi.object({
        product: joi.string(),
        user: joi.string(),
        address: joi.string(),
        quantity: joi.number().min(1),
        status: joi.bool(),
        payment_method: joi.string()
    })
    const { value, error } = schema.validate(body) //validation me object destructuring
    if (error) {
        return new Error(error.details[0].message)
    }
    if (value.product) { //agar value me p[roduct filed ho toh
        const product = await Product.findById(value.product)
        value.price = product.price
    }//price change krne ke liye
    // value set krne ke liye
    const result = await Order.findOneAndUpdate({ _id: _id }, { $set: value }, { new: true })
    resp.json({ result })

}
// -------------------------------------------------------------------------------------

module.exports = { getOrders, placeOrder, getOrdersofUser, deleteOrders, updateOrder }


