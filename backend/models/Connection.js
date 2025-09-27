const mongoose = require('mongoose');

const Connection = new mongoose.Schema({

    Connection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true,
    },
});

module.exports = mongoose.model('Connections', Connection);
