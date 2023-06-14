const express = require('express');
const mysql = require('mysql');

var cors = require('cors')
const routes = require('./routes')
const config = require('./config.json')

const app = express();
app.use(cors({ credentials: true, origin: ['http://localhost:3000'] }));


/*************************************
* Server.js registers all the routes 
* from the routes.js file. It
* registers all of them as GET.
*************************************/
app.get('/hello', routes.hello)

app.get('/city', routes.city) 

app.get('/map_city', routes.lon_lat) 

app.get('/search/cities', routes.search_cities)

app.get('/search/cuisine', routes.get_cuisine)

app.get('/search/budget', routes.get_city_by_budget)

app.get('/search/aqi', routes.get_city_by_AQI)

app.get('/search/veggie_cities', routes.get_veggie_cities)

app.get('/search/mich_cities', routes.get_mich_cities)
 
app.get('/search/room_type_cities', routes.get_room_type_cities)

app.get('/filter/cities', routes.filter_cities)

app.get('/filter/restaurants', routes.filter_restauraunts)

app.get('/search/top50PolluteCities', routes.get_top50_polluted_cities)

app.get('/search/youthRatio', routes.get_youth_ratio)

app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
