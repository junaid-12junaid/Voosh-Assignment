const express = require('express');
const route = require('./src/routes/route');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer')


app.use(express.json());
app.use(multer().any())

mongoose.connect("mongodb+srv://Junaid:OmiBBhzoWGFH0BY0@cluster0.axj9x.mongodb.net/voosh")
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.use('/', route)


app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});