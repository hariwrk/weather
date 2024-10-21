const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');

const app = express();
const port = 3003;

mongoose.connect('mongodb://127.0.0.1:27017/weatherDB',{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('mongo db connected'))
    .catch((err) => console.log('failed to connect', err))


const weatherSchema = new mongoose.Schema({
    "temp": Number,
    "feels_like": Number,
    "temp_min": Number,
    "temp_max": Number,
    "pressure": Number,
    "humidity": Number,
    "sea_level": Number,
    "grnd_level": Number
})

const Weather = mongoose.model('Weather', weatherSchema);

app.get('/get',async (req,res) =>{
    try{
        const apiKey = 'db041944dac613fafccb73ac9ed0c66b';
        const city = req.query.city;

        if(!city) return res.status(400).json({msg:"provide city"})
        
        const url =  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

        const response = await axios.get(url);

        const data = response.data.main;

        const newWeather = new Weather({
            "temp": data.temp,
            "feels_like": data.feels_like,
            "temp_min": data.temp_min,
            "temp_max": data.temp_max,
            "pressure": data.pressure,
            "humidity": data.humidity,
            "sea_level": data.sea_level,
            "grnd_level": data.grnd_level
        })

        await newWeather.save();

        res.json({
            msg: "data saved",
            weatherData: newWeather
        })
    }catch(error){
        console.error(error);
    }
})

app.listen(port,() => { console.log(`server running on port ${port}`);
});