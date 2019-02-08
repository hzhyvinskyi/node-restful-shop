const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

const ordersRoutes = require('./api/routes/orders');
const productRoutes = require('./api/routes/products');

app.use(morgan('dev'));

app.use('/orders', ordersRoutes);
app.use('/products', productRoutes);

app.use((req, res, next) => {
    if(req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
        return res.sendStatus(204);
    }

    return next();
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