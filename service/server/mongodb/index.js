
const mongoose = require('mongoose');
const MONGODB_URL= 'mongodb://120.78.193.59:27017/testapp'
const InitiateMongoServer = async () => {
    // 连接mongodb
    mongoose.connect(MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection mongodb error:'));
    db.once('open', () => {
        // we're connected!
        console.log('connection mongodb success');
    });
}

module.exports = InitiateMongoServer