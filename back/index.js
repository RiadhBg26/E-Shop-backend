const express =  require ('express');
const bodyParser = require ('body-parser')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//Initialize express app
const app = express();


/* CORS */
app.use(cors({
    origin: '*',
    methods: ['GET', 'PUT', 'DELETE', 'PATCH', 'POST'],
    allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept'
}));


//Import Routes
const proudctRouter = require('./routes/products')
const ordersRouter = require('./routes/orders')
const usersRouter = require('./routes/users')
const authRouter = require ('./routes/auth')

/
//Use Routes
app.use('/api/products', proudctRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/users', usersRouter);
app.use('/api/auth' , require ('./routes/auth' ))

app.use(bodyParser.json(), bodyParser.urlencoded({extended: false}));
app.use(logger(format="dev"));


app.get('/', function(req, res) {
    console.log('GET method');   
    res.json({msg: 'welcome'})
})
app.use(function(res, req, next, err) {
    res.status(err.status || 500);
    res.json({err : error})
})

app.listen(process.env.port || 4000, function(){
    console.log('listening to requests..');
    
})