const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
    res.status(200).json({
        message: 'It works!'
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});