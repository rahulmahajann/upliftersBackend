const express = require('express');
const bodyParser = require('body-parser');
const app=express();

const databaseConnection = require('./databaseConnection');

const PORT = 5000;
databaseConnection();

const userRouter = require('./routes/userRoutes');
const videoRouter = require('./routes/videoRoutes');
const userVideoRouter = require('./routes/userVideoRoutes');
app.use(bodyParser.json({extended: true}));
app.use(bodyParser.urlencoded({extended: true}));
app.get('/healthy', (req, res) => {
    res.send('backend is running');
});

app.use('/user', userRouter);
app.use('/video', videoRouter);
app.use('/uservideo', userVideoRouter);

app.listen(PORT, () => {
    console.log(`PORT IS RUNNING ON ${PORT}`);
})