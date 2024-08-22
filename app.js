const swaggerUi =require( "swagger-ui-express")
const swaggerDoc =require("swagger-jsdoc")

const express=require("express")
const app=express()
const db=require("./database/database")
const cookieParser = require('cookie-parser')
var cors = require('cors')
const bodyParser = require('body-parser');
const userRoutes=require('./routes/routes')
const multer=require("multer")
const path =require("path")
require('dotenv').config()

const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Job Portal Application",
        description: "Node Expressjs Job Portal Application",
      },
      servers: [
        {
          // url: "http://localhost:3000",
                 url: "https://portalbackend-x872.onrender.com"
        },
      ],
    },
    apis: ["./routes/*.js"],
  };
  
  const spec = swaggerDoc(options);
// app.use(express.static("./uploads"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())
app.use(cors())
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname,'uploads') ) )
app.use('/api', userRoutes);
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));
const PORT=process.env.PORT
app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});