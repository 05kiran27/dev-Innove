const mongoose = require('mongoose');

const connect = () => {
    mongoose.connect(process.env.DATABASE_URL, {
        // useNewUrlParser:true,
        // useUnifiedTopology:true
    })
    .then( () => {
        console.log("database connection successful")
    })
    .catch( (error) => {
        console.log("error while connecting database");
        console.error(error.message);
        process.exit(1);
    });
}

module.exports = connect;