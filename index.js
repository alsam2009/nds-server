import express from 'express';
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'

import router from './routes/news.route.js'

const app = express();
dotenv.config();

// Constants
const PORT = process.env.PORT || 3000
const DB_CONNECT = process.env.DB_CONNECT

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// Routes
app.use('/', router)

// Connect to DB & start Server
async function start() {
  try {
    await mongoose.connect(DB_CONNECT)
      console.log('MongoDB connect successfully')
      app.listen(PORT, () => console.log(`Server started on port ${PORT}...`))
  } catch (error) {
    console.log(error);
    process.exit(1)
  }
}
start()
