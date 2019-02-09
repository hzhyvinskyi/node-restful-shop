const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

const ordersRoutes = require('./api/routes/orders');
const productRoutes = require('./api/routes/products');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use((req, res, next) => {
    req.header('Access-Control-Allow-Origin', '*');
    req.header(
        'Access-Control-Allow-Headers',
        'Accept, Authorization, Content-Type, Origin, X-Requested-With'
    );
    if(req.method === 'OPTIONS') {
        req.header(
            'Access-Control-Allow-Methods',
            'GET, POST, PUT, PATCH, DELETE'
        );
        return req.status(200).json({});
    }
    next();
});

app.use('/orders', ordersRoutes);
app.use('/products', productRoutes);

app.use((req, res, next) => {
    if(req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }    
    next();
});

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});