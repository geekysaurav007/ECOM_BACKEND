//  .........cpoyright@ saurav_ranjan---------->>>>>>
const { response } = require('express')
const { Product } = require('../models/product')
const joi = require('joi')
const  upload_Folder =process.env.UPLOAD_FOLDER

async function getProducts(req, resp) {
    const products = await Product.find()
    resp.json({ products })
}
// ------>creating product validation function<-----------
function validateProduct(data) {
    // name,price,discount,productimage,category,active
    const productschema = joi.object({
        name: joi.string().min(4).max(30).required(),
        price: joi.number().min(1).required(),
        discount: joi.number(),
        category: joi.string().required(),
        active: joi.bool()

    })
    const result = productschema.validate(data)
    return result;
}

// creating api for adding product which is using multer also
async function createProduct(req, resp, next) {
    const productImage =upload_Folder + "/" + req.file.filename
    const val_result = validateProduct(req.body);
    if (val_result.error) {
        return next(new Error(val_result.error.details[0].message))
    }
    let product = new Product({
        ...val_result.value, productImage //giving image name should be same as model name
    })
    const result = await product.save()
    resp.json({ result })
}
// ----------------------------------------------------->>>>>>>>>>>>>>>>>>>>               

// function for getting products by id=-----------
async function getProductbyId(req,resp){
    const _id=req.params.id
    const result=await Product.findOne({_id})
    return resp.json({result})
}
// ------------------------------------>>>>>>>>>>

module.exports = { getProducts, createProduct,getProductbyId}