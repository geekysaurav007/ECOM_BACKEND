const express = require('express')
require('express-async-errors')

// environment variable configuration
require('dotenv').config()

// ------------------------------
// GETTING CONNECTED WITH DB
require('./database/connection')()
// ----------------------------
const morgan = require('morgan')
const handleError = require('./middlewares/error-handler')
const { categoryRouter } = require('./router/category-router')
const { orderRouter } = require('./router/order-router')
const { productRouter } = require('./router/product-router')
const { userRouter } = require('./router/user-router')
const app = express()
var cors = require('cors')
const upload_Folder = process.env.upload_Folder
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.listen(3000, () => {
    console.log("RUNNING ON 3000")
})


app.get('/', (req, resp) => {
    resp.json({ "message": "success saurav" })
})

const apiRouter = express.Router()

apiRouter.get('', (req, resp) => {
    resp.json({ "message": "hello saurav" })
})
app.use('/api', apiRouter)


apiRouter.use('/users', userRouter)
apiRouter.use('/products', productRouter)
apiRouter.use('/orders', orderRouter)
apiRouter.use('/categories', categoryRouter)



// serving images.............>>>
apiRouter.get('/' + upload_Folder + "/*", (req, resp, next) => {
    const path = req.url
    const filepath = `${__dirname}${path}`
    resp.sendfile(filepath, (err) => {
        next()
    })
})
// ------------------------------>>

app.use(handleError)


// const {users}=require('./fakedata')
// const hashpass=require("password-hash")
// const { User } = require('./models/user')
// let newusers=users.map(user=>{
//     user.password=hashpass.generate('123456')
//     return user
// })
// User.create(newusers)
// .then(res=>{
//     console.log(res)
// })