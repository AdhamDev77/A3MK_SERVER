const express = require('express')
var cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config()

const usersRoutes = require('./routes/users')
const consRoutes = require('./routes/cons')
const commRoutes = require('./routes/comm')

// express app
const app = express()

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.json({msg: "Welcome Bro"})
})

app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use('/api/users', usersRoutes)
app.use('/api/cons', consRoutes)
app.use('/api/comm', commRoutes)

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    app.listen(process.env.PORT, () => {
    console.log('listening ya3am !!')
    })
})
.catch((error) => {
    console.log(error)
})
