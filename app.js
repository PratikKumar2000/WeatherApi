const { response } = require('express');
const express = require('express');
const http = require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.post('/city', (req, res) => {
    const query = req.body.cityName;
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid=ae1ef73cb1723860ffb832923300a98a&units=metric"
    http.get(url,(response)=>{
        // console.log(response);
        response.on('data', (data) => {
            const weatherdata = JSON.parse(data);
            console.log(weatherdata);
            const temp = weatherdata.main.temp;
            const weatherDescription = weatherdata.weather[0].description;
            const icon = weatherdata.weather[0].icon;
            const icon_url = "http://openweathermap.org/img/wn/" +icon + "@2x.png"
            // res.write("<p>The weather is currently " + weatherDescription + "</p>");
            // res.write("<h1>The temperature in city " + query + " is " + temp + " K</h1>");
            // res.write("<img src =" + icon_url + ">");
            var today = new Date();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            res.render('weather', {
                city: query, temp: temp, description: weatherDescription, icon: icon_url, currentDay: getCurrentDay(),
                currentMonth: getCurrentMonth(),
                currentDate: getDate(),
                currentYear: getYear(),
                time : time
            });
        })
    })
})
function getCurrentDay() {
    const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday",
        "Saturday"];
    let currentTime = new Date();
    return weekday[currentTime.getDay()];
}
function getCurrentMonth() {
    const months =[
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    let currentTime = new Date();
    return months[currentTime.getMonth() + 1];
}
function getDate() {
    let currentTime = new Date();
    return currentTime.getDate();
}
function getYear() {
    let currentTime = new Date();
    return currentTime.getFullYear();
}
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.listen(3000, function () {
    console.log('Server is listening on port 3000');
});