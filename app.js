const express=require("express")
const app=express()
const db=require("./database/database")
const cookieParser = require('cookie-parser')
var cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes=require('./routers/routes')
require('dotenv').config()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.use('/api', userRoutes);
const PORT=process.env.PORT
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});