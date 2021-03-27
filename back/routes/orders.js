const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');
const crypto = require('crypto');

// GET ALL ORDERS
router.get('/', (req, res) => {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    database.table('orders as od')
        .join([
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.id = od.user_id'
            }
        ])
        .withFields(['od.id', 'p.name', 'p.price', 'u.username'])
        .getAll()
        .then(orders => {
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({ message: "No orders found" });
            }

        }).catch(err => res.json(err));
});

// Get Single Order
router.get('/:id', async (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    let orderId = req.params.id;
    console.log(orderId);

    database.table('orders_details as od')
        .join([
            {
                table: 'orders as o',
                on: 'o.id = od.order_id'
            },
            {
                table: 'products as p',
                on: 'p.id = od.product_id'
            },
            {
                table: 'users as u',
                on: 'u.userId = o.user_id'
            }
        ])
        .withFields(['o.id', 'p.name', 'p.description', 'p.price', 'p.image', 'od.quantity as quantityOrdered', 'u.username'])
        .filter({ 'o.id': orderId })
        .getAll()
        .then(orders => {
            console.log('orders are :', orders);
            if (orders.length > 0) {
                res.json(orders);
            } else {
                res.json({ message: "No orders found" });
            }

        }).catch(err => res.json(err));
});

// Place New Order
router.post('/new', async (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // let userId = req.body.userId;
    // let data = JSON.parse(req.body);
    let { userId, products } = req.body;
    console.log('1: ',userId);
    console.log('2: ',products);
    
    if (userId !== null && userId !== 0) {
        // console.log('true');
        database.table('orders')
            .insert({
                user_id: userId
            }).then((newOrderId) => {
                console.log('order id is : ' ,newOrderId);
                if (newOrderId > 0) {
                    products.forEach(async (p) => {

                        let data = await database.table('products').filter({ id: p.id }).withFields(['quantity']).get();

                        let inCart = parseInt(p.inCart);

                        // Deduct the number of pieces ordered from the quantity in database

                        if (data.quantity > 0) {
                            data.quantity = data.quantity - inCart;

                            if (data.quantity < 0) {
                                data.quantity = 0;
                            }

                        } else {
                            data.quantity = 0;
                        }

                        // Insert order details w.r.t the newly created order Id
                        database.table('orders_details')
                            .insert({
                                order_id: newOrderId,
                                product_id: p.id,
                                quantity: inCart
                            }).then(newId => {
                                database.table('products')
                                    .filter({ id: p.id })
                                    .update({
                                        quantity: data.quantity
                                    }).then(successNum => {
                                    }).catch(err => console.log(err));
                            }).catch(err => console.log(err));
                    });

                } else {
                    res.json({ message: 'New order failed while adding order details', success: false });
                }
                res.json({
                    message: `Order successfully placed with order id ${newOrderId}`,
                    success: true,
                    order_id: newOrderId,
                    products: products
                })
            }).catch(err => res.json(err));
    }

    else {
        res.json({ message: 'New order failed', success: false });
    }

});

// Payment Gateway
router.post('/payment', (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    setTimeout(() => {
        res.status(200).json({ success: true });
    }, 3000)
});

module.exports = router