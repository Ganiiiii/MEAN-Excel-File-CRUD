const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Routes = require('./api/routes/routes');

//MongoDb Connection
mongoose.connect('mongodb+srv://test:' + process.env.MONGO_ATLAS_PW + '@cluster0-zxgny.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true });

//morgan code to log every file
app.use(morgan('dev'));

//code to parse JSON bodies
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

//handling CORS errors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
  
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
  });

//handling routes
app.use('/routes',Routes);

//handling errors
app.use((req,res,next)=>
{
    const error = new Error('Not Found...!');
    error.status = 400;
    next(error);
})

app.use((error,req,res,next)=>{
    res.status(error.status || 500).json({
        error: {
            message:error.message
        }
    });
})

module.exports = app;