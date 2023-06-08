const { category } = require('../models/category')
const joi = require('joi')
const { Product } = require('../models/product')
//  function to get all categories------->>>>>
async function getCategories(req, resp) {
    // response.json({ "messgae": "category Api working from controllers....." })
    const categories = await category.find().select('id name')
    return resp.json({ categories })
}
// ------------------------------------------------>


//  function to create categories------->>>>>>>>>
async function createCategory(req, resp, next) {
    const schema = joi.object({
        name: joi.string().min(3).max(20).required()
    })
    const valresult = schema.validate(req.body)
    if (!valresult) {
        const name = valresult.value.name
        const Category = await new category(name).save()
        return resp.json(Category)
    }
    const err = new Error(valresult.error.details[0].message)
    return next(err)

}
// ----------------------------------------------------------------->

// get category by id
async function getCategoryById(req, resp) {
    const _id = req.params.categoryId
    const result = await category.findOne({ _id })
    return resp.json({ result })
}
// ------------------------------------>

// get products by categoryId
async function getProductByCategoryId(req, resp, next) {

    const result = await Product.find({ category: req.params.categoryId }).
    populate("category")
    return resp.json({ result })

}
module.exports = { getCategories, createCategory, getCategoryById, getProductByCategoryId }