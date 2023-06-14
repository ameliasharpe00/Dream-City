import config from './config.json'

/*************************************
* Fetcher creates calls for to connect 
* backend with the frontend.
*************************************/

// Call /search/cuisine query
const getCuisineSearch = async (cuisine) => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/cuisine?cuisine=${cuisine}`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/budget query
const getBudgetSearch = async (budget) => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/budget?budget=${budget}`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/room_type_cities query
const getRoomSearch = async (room) => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/room_type_cities?room=${room}`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/veggie_cities query
const getVeggieCities = async () => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/veggie_cities`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/mich_cities query
const getMichCities = async () => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/mich_cities`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/aqi query
const getAqiCities = async () => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/aqi`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/top50PolluteCities query
const getTop50Polluted = async () => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/top50PolluteCities`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /search/youthRatio query
const getYouthRatio = async () => {
    var url_add = `http://${config.server_host}:${config.server_port}/search/youthRatio`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Call /filter/cities query
const getCityFilter = async (NO2_AQI, SO2_AQI, CO_AQI, cuisine, price_per_night) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/filter/cities?NO2_AQI=${NO2_AQI}&SO2_AQI=${SO2_AQI}&CO_AQI=${CO_AQI}&cuisine=${cuisine}&price_per_night=${price_per_night}`, {
        method: 'GET',
    })
    return res.json()
}

// Call /filter/restaurants query
const getRestaurantFilter = async (NO2_AQI, SO2_AQI, CO_AQI, isMichelin, price_per_night) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/filter/restaurants?NO2_AQI=${NO2_AQI}&SO2_AQI=${SO2_AQI}&CO_AQI=${CO_AQI}&isMichelin=${isMichelin}&price_per_night=${price_per_night}`, {
        method: 'GET',
    })
    return res.json()
}

// Call /map_city query
const getLonLat = async (city, state) => {
    var url_add = `http://${config.server_host}:${config.server_port}/map_city?city=${city}&state=${state}`
    var res = await fetch(url_add, {
        method: 'GET',
    })
    return res.json()
}

// Export all those functions to use on the frontend
export {
    getCuisineSearch,
    getBudgetSearch,
    getRoomSearch,
    getVeggieCities,
    getMichCities,
    getAqiCities,
    getCityFilter,
    getRestaurantFilter,
    getTop50Polluted,
    getYouthRatio,
    getLonLat
}