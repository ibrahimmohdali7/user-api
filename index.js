const Joi = require("joi");
const express = require("express");
const mongoose = require("mongoose")
const app = express();
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const port = process.env.PORT || 7000;
require('dotenv/config')
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      version: "1.0.0",
      title: "User API",
      description: "User API Information",
    }
  },
  // ['.routes/*.js']
  apis: ['./routes/*.js']
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const authRoute = require("./routes/auth")

app.use('/api/user', authRoute);
mongoose.connect(process.env.DB_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  function (err, db) {
    if (err)
      console.log('mongo err', err);
    else {
      console.log('Mongo Connected!');
    }
  }
)
console.log('mongoose.connect', mongoose.connect)

app.listen(port, () => console.log(`working on ${port}`));
