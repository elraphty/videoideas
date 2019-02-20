const mongoose = require('mongoose');

// Using Global Promise for Mongoose
mongoose.Promise = global.Promise;

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true
})
    .then(() => { console.log("MongoDb connected") })
    .catch(err => console.log(err));

module.exports = mongoose;