const mongoose = require('mongoose')
const colors = require('colors')

const connectDB = async()=>{
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
    if(conn){
      console.log(`Database connected: ${mongoose.connection.host}`.bgCyan)
    }
  } catch (error) {
    console.log(`error to connect databse: ${error}`.bgRed)
  }
}
module.exports = connectDB;