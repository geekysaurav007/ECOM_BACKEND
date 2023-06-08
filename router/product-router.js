// ---------->>>>>@saurav_ranjan----------------------->>>>>
const express=require('express')
const multer=require('multer')

const path=require('path')
const upload_Folder=process.env.upload_Folder
//creteing a folder where photos will be saved above
const tempMulter=multer({dest:upload_Folder}) //giving destination to a variable
// creating storage space------------------------------------->>>>>>>>>
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest=path.join(__dirname,"../") +upload_Folder 
        // __dirname gives the currentv laction of project + upload_folder adress will be joined
              cb(null, dest)
    },
    filename: function (req, file, cb) {
     const fileName=mongoose.Types.ObjectId()+".png"//creting a file name
      cb(null, fileName)
    }
  })
// --------------------------------------------------------->>>>>>>>>>>>>>>>>.>> 
const upload = multer({storage}) //passing disk storage

// creating routes.................>>>>>>>
const {getProducts,createProduct,getProductbyId} = require('../controller/product-controller')
const { adminAuthMiddleware } = require('../middlewares/user-auth-middleware')
const { default: mongoose } = require('mongoose')
const productRouter=express.Router()

productRouter.get('/:id',getProductbyId)
productRouter.get('/',getProducts)
// creating router for adding product by adding using multer
productRouter.post('/create-products',adminAuthMiddleware,upload.single('image'),createProduct)

module.exports={productRouter}