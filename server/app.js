require('dotenv').config();
const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios");
const validateObj = require("./validation");
const app = express();
const API_BASE_URL = 'https://api.polygon.io/v1/open-close'
app.use(function (req, res, next) {
    const allowedOrigins = ['http://localhost:3000'];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-credentials", true);
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE");
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.enable('trust proxy');



app.post('/api/fetchStockData', async (req, res) => {
    // YOUR CODE GOES HERE, PLEASE DO NOT EDIT ANYTHING OUTSIDE THIS FUNCTION

    try {

        const { stocksTicker, Date } = req.body;
        console.log(req.body, stocksTicker, Date);
        let checkValidationMessage;
        await validateObj.fetchStockData.validate(req.body).catch((error) => {
            checkValidationMessage = error.message;
        })
        if (checkValidationMessage) {
            return res.status(400).json({ message: checkValidationMessage })
        }

        const response = await axios.get(`${API_BASE_URL}/${stocksTicker}/${Date}?adjusted=true&apiKey=${process.env.API_KEY}`);
        let { status, open, high, low, close, volume } = response.data

        res.json({ status, open, high, low, close, volume });

    } catch (error) {

        if (error?.response?.status == 403) {   // handle 403 forbidden error response
            return res.status(error.response.status).json({ message: "You don't have permission to access the requested resource." })
        }
        if (error?.response?.data) {
            return res.status(error.response.status).json({ message: error.response?.data?.error || "Data Not Found" })
        }
        res.status(502).json({ message: "Internal Server Error" })

    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));