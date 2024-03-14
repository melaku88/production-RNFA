const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const morgan = require('morgan')
const colors = require('colors')
const connectDB = require('./config/db')

// DOTENV CONFIG
dotenv.config()

// DATABASE CONNECTION
connectDB();

// REST OBJECT
const app = express()

// MIDDLEWARES
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

// ROUTES
app.use('/api/v1/auth', require('./routes/userRoutes'))
app.use('/api/v1/post', require('./routes/postRoues'))

// HOME
app.get('/', (req, res)=>{
  return res.send({
    'success': true,
    'message': 'Node Server Running'
  })
})
// PORT
const PORT = process.env.PORT || 8080

// LISTENNING
app.listen(PORT, ()=>{
  console.log(`Server is running on port ${PORT}`.bgGreen)
})



// XLkxo3pShZyWEtHr
