const mongoose = require('mongoose');

    const URL = 'mongodb+srv://kalaindia:kalaindia1234@kala.7ibng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const databaseConnection = async () => {
    try{
        mongoose.connect(URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('mongoDb connection running!');
    }catch(err){
        console.log('mongoDb connection error!', err)
    }
}

module.exports = databaseConnection;