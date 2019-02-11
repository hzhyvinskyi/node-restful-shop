if(process.env.NODE_ENV === 'production') {
    module.exports = {
        mongoURI: 'mLAB string'
    };
} else {
    module.exports = {
        mongoURI: 'mongodb://localhost/node-restful-shop'
    };
}