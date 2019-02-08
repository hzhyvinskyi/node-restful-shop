const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const ordersRoutes = require('./api/routes/orders');
const productRoutes = require('./api/routes/products');

app.use('/orders', ordersRoutes);
app.use('/products', productRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});