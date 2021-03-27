const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers')

//GET all Prouducts
router.get('/', function (req, res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //set the current page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;//set limit of itmes per page

    let startValue
    let endValue

    if (page > 0) {
        startValue = (page + limit) - limit //0, 10,20,30..
        endValue = page + limit
    } else {
        startValue = 0;
        endValue = 10
    }


    database.table(table = 'products as prod').join([{
        table: 'categories as categ',
        on: 'prod.category = categ.id'
    }])
        .withFields(fields = [
            'categ.name as category_name',
            'prod.id as id',
            'prod.name as name',
            'prod.price as price',
            'prod.description as description',
            'prod.category as product_category',
            'prod.image as image',
            'prod.quantity as quantity'

        ])
        .slice(startValue, endValue)
        .sort(key = { id: .1 })
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
                console.log('good');
            } else {
                res.json({ message: 'No products found' })
                console.log('bad');
            }
        }).catch(err => console.log(err))

    // res.render('index', {title: 'Express'})
    // res.json({msg: 'welcome to express app'})
});

//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////


//GET one product
router.get('/:prodId', (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    let productId = req.params.prodId;
    // console.log(prodId);
    console.log('good');

    database.table(name = 'products as prod').join([{
        table: 'categories as categ',
        on: 'prod.category = categ.id'
    }])
        .withFields(fields = [
            'categ.name as category',
            'prod.id as id',
            'prod.name as name',
            'prod.price as price',
            'prod.description as description',
            'prod.category as product_category',
            'prod.image as image',
            'prod.images as images',
            'prod.quantity as quantity'
        ])
        .filter({ 'prod.id': productId })
        .get()
        .then(prod => {
            if (prod) {
                res.status(200).json(prod);
                console.log('good');
            } else {
                res.json({ message: `No products found with id ${productId}` })
                console.log('bad');
            }
        }).catch(err => console.log(err))

})


//////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////



//GET all roducts from one category
router.get('/category/:catName', (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    let page = (req.query.page !== undefined && req.query.page !== 0) ? req.query.page : 1; //set the current page number
    const limit = (req.query.limit !== undefined && req.query.limit !== 0) ? req.query.limit : 10;//set limit of itmes per page

    let startValue
    let endValue

    if (page > 0) {
        startValue = (page + limit) - limit //0, 10,20,30..
        endValue = page + limit
    } else {
        startValue = 0;
        endValue = 10
    }

    //Fetch the category name from the URL
    let categ_name = req.params.catName

    database.table(name = 'products as prod').join([{
        table: 'categories as categ',
        on: `categ.id = prod.category WHERE categ.name LIKE '%${categ_name}%' `
    }])
        .withFields(fields = [
            'prod.id as id',
            'prod.name as name',
            'prod.category as category',
            'prod.description as description',
            'prod.image as image',
            'prod.images as images',
            'prod.price as price'

        ])
        .slice(startValue, endValue)
        .getAll()
        .then(prods => {
            if (prods.length > 0) {
                res.status(200).json({
                    count: prods.length,
                    products: prods
                });
                console.log('good');
            } else {
                res.json({ message: `No products found in ${categ_name} ` })
                console.log('bad');
            }
        }).catch(err => console.log(err))


})


module.exports = router