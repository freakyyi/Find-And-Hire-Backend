const express= require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const indexRouter = require('./routes/index')
const errorController = require('./controllers/error.controller')
var cors = require('cors');
const PORT = process.env.PORT || 3001

dotenv.config();

// connect  to db

mongoose.connect(process.env.DB_CONNECT,
{useNewUrlParser : true},
() => console.log('connected to db')
);

// MiddleWares

app.use(express.json());


// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// route middlewares


app.use('/api',indexRouter)

// handling non registered request, error 404 page

app.use(errorController.get404)

if(process.env.NODE_ENV === 'production'){
    
}


app.listen(PORT,()=> console.log('Server up and running'))

