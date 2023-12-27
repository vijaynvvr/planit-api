const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoute = require('./routes/auth');
const todoRoute = require('./routes/todos');
require('dotenv').config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true}))

const PORT = process.env.PORT || 5000;

const connectWithDb = require('./config/db');
connectWithDb();

app.use("/api/auth", authRoute);
app.use("/api/todo", todoRoute);


app.listen(PORT, () => {
    console.log('App started on port no. ' + PORT);
})

app.get('/', (req, res) => {
    res.send("Welcome");
})

