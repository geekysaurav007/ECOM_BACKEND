const express=require('express')
const { getCategories,createCategory,getCategoryById,
    getProductByCategoryId } = require('../controller/category-controller')
const { adminAuthMiddleware } = require('../middlewares/user-auth-middleware')
const categoryRouter=express.Router()


categoryRouter.get('',getCategories)

categoryRouter.get('/:categoryId',getCategoryById)

categoryRouter.get('/:categoryId/products',getProductByCategoryId)


categoryRouter.post('',adminAuthMiddleware,createCategory) 
//api/categories

module.exports={categoryRouter}