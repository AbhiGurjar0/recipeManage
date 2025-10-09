const express = require('express');
const app = express();
const userRouter = require('./routes/userRoutes')
const db = require('./config/db');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
dotenv.config();
const admin = require('./routes/admin');
app.use(express.static('public'));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", 'ejs');

app.use('/', userRouter);
app.use('/admin', admin);
app.listen(3000, () => {
    console.log("Server is Running...")
})