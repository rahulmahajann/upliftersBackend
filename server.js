const express = require('express');

const app=express();

const databaseConnection = require('./databaseConnection');

const PORT = 5000;
databaseConnection();


app.listen(PORT, () => {
    console.log(`PORT IS RUNNING ON ${PORT}`);
})