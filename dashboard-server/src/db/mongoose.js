const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/socialMedia',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useFindAndModify:true,
    useCreateIndex:true
}).
then(() => {
        console.log('Successfully connected to database.........');
    }
).catch(() => {
    console.log('Failed to connect.......');
})