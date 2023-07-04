require('dotenv').config();
import express from 'express';
const connectDB = require('./config/dbConfig');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/API/v1/',require('./controller/usersController'));
app.use('/API/v1/',require('./controller/postController'));

app.get("/", (req, res) => {
    try {
        res.send(`<h1>Backend api server is working.<h1>`);
    } catch (err: any) {
        res.send(`Server is not respond ${err.message}.`);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    // if (err) throw new Error("server connection time error.");
    // else 
    console.log(`Backend server is running on ${port}.`);
    connectDB();
})