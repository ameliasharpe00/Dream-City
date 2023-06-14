const { expect } = require("@jest/globals");
const supertest = require("supertest");
const { number } = require("yargs");
const results = require("./results.json")
const app = require('../server');

// // **********************************
// //        BASIC ROUTES TESTS
// // **********************************

// Test the hello query with no parameters
test("GET /hello no parameters", async () => {
    await supertest(app).get("/hello?")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.text).toBe("Hello! Welcome to the Dream City server!")
      });
});


// Test the hello query with name parameter
test("GET /hello with name", async () => {
  
    await supertest(app).get("/hello?name=Steve")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.text).toBe("Hello, Steve! Welcome to the Dream City server!")
      });
});

// Test the hello query with "Dream City" as a parameter
test("GET /hello with dream city", async () => {
  
    await supertest(app).get("/hello?name=Dream%20City")
      .expect(200)
      .then((response) => {
        // Check text 
        expect(response.text).toBe("Hello, is your name the same as our server's?")
      });
});

// **********************************
//        GENERAL ROUTES TESTS
// **********************************

// Test the city query
test("GET /city", async () => {
  await supertest(app).get("/city")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(28319)
    });
});

// Test the map_city query with no parameters
test("GET /map_city no city provided", async () => {
  await supertest(app).get("/map_city")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.LosAngelesDetails)
    });
});


// Test the map_city query with both city and state provided 
test("GET /map_city city provided", async () => {
  await supertest(app).get("/map_city?city=Seattle&state=Washington")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1)
      expect(response.body.results).toStrictEqual(results.SeattleDetails)
    });
});


// Test the map_city query with only city
test("GET /map_city city provided but no state", async () => {
  await supertest(app).get("/map_city?city=Seattle")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(0)
    });
});


// Test the map_city query with only state
test("GET /map_city state provided but no city", async () => {
  await supertest(app).get("/map_city?state=Washington")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(0)
    });
});


// Test the search/cuisine query with no params
test("GET /search/cuisine no cuisine provided", async () => {
  await supertest(app).get("/search/cuisine")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(12)
    });
});


// Test the search/cuisine query with Indian cuisine provided
test("GET /search/cuisine cuisine provided", async () => {
  await supertest(app).get("/search/cuisine?cuisine=Indian")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(17)
    });
});


// Test the search/cuisine query with wrong params
test("GET /search/cuisine cuisine provided but wrong", async () => {
  await supertest(app).get("/search/cuisine?cuisine=aajanajba")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(0)
    });
});


// Test the search/budget query with no params
test("GET /search/budget budget not provided", async () => {
  await supertest(app).get("/search/budget")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1548)
    });
});


// Test the search/budget query with budget parameter provided
test("GET /search/budget budget provided", async () => {
  await supertest(app).get("/search/budget?budget=1500")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1045)
    });
});


// Test the search/aqi query with no params
test("GET /search/aqi", async () => {
  jest.setTimeout(10000) 
  await supertest(app).get("/search/aqi")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(10) // cause 10 is the default
      expect(response.body.results[0]).toStrictEqual(results.AQIRankingCity)
    });
}, 6000);


// Test the search/aqi query with n provided
test("GET /search/aqi n = 20", async () => {
  jest.setTimeout(10000)
  await supertest(app).get("/search/aqi?n=20")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(20) 
      expect(response.body.results[0]).toStrictEqual(results.AQIRankingCity)
    });
}, 6000);


// Test the search/veggie_cities
test("GET /search/veggie_cities", async () => {
  await supertest(app).get("/search/veggie_cities")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(62) 
      expect(response.body.results[0]).toStrictEqual(results.MostVeggieCity)
    });
}, 6000);


// Test the search/mich_cities
test("GET /search/mich_cities", async () => {
  await supertest(app).get("/search/mich_cities")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(36) 
      expect(response.body.results[0]).toStrictEqual(results.MostMichCity)
    });
});


// Test the search/room_type_cities with no params
test("GET /search/room_type_cities no argument provided", async () => {
  await supertest(app).get("/search/room_type_cities")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1438) 
      expect(response.body.results[0]).toStrictEqual(results.PrivateRoomCity)
    });
});


// Test the search/room_type_cities with params
test("GET /search/room_type_cities argument provided", async () => {
  await supertest(app).get("/search/room_type_cities?room=Hotel%20Room")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(15) 
      expect(response.body.results[0]).toStrictEqual(results.HotelRoomCity)
    });
}, 10000);



// Test the filter_cities with no params
test("GET /filter/cities no argument provided", async () => {
  jest.setTimeout(15000)
  await supertest(app).get("/filter/cities")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(5) 
      expect(response.body.results[0]).toStrictEqual(results.FilterCity1)
    });
}, 30000);


// Test the filter_cities with all params
test("GET /filter/cities arguments provided", async () => {
  jest.setTimeout(20000)
  await supertest(app).get("/filter/cities?NO2_AQI=100&SO2_AQI=100&CO_AQI=100&cuisine=Indian&price_per_night=200")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(5) 
      expect(response.body.results[0]).toStrictEqual(results.FilterCity2)
    });
}, 30000);


// Test the /filter/cities with some params correct, some invalid, and some missing
test("GET /filter/cities only some arguments provided, others invalid", async () => {
  jest.setTimeout(20000)
  await supertest(app).get("/filter/cities?NO2_AQI=100&CO_AQI=d&cuisine=Indian&price_per_night=2j0")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(5) 
    });
}, 30000);


// Test the /filter/restaurants with no params
test("GET /filter/restaurants no args", async () => {
  jest.setTimeout(15000)
  await supertest(app).get("/filter/restaurants")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(96) 
      expect(response.body.results[0]).toStrictEqual(results.FilterRes)
    });
}, 30000);


// Test the /filter/restaurants with args
test("GET /filter/restaurants with args", async () => {
  jest.setTimeout(15000)
  await supertest(app).get("/filter/restaurants?NO2_AQI=100&SO2_AQI=100&CO_AQI=100&isMichelin=1&price_per_night=200")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(249) 
    });
}, 30000);


// Test the /filter/restaurants with args and some missing and some incorrect
test("GET /filter/restaurants with args but some missing and some incorrect", async () => {
  jest.setTimeout(15000)
  await supertest(app).get("/filter/restaurants?SO2_AQI=100&CO_AQI=g&price_per_night=200")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(96) 
    });
}, 30000);


// Test the /search/top50PolluteCities
test("GET /search/top50PolluteCities", async () => {
  await supertest(app).get("/search/top50PolluteCities")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(82) 
      expect(response.body.results[0]).toStrictEqual(results.PollutedCity)
    });
}, 30000);


// Test the /search/youthRatio
test("GET /search/youthRatio", async () => {
  await supertest(app).get("/search/youthRatio")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(15320) 
    });
}, 70000);


// Test the /search/cities with no arguments
test("GET /search/cities no args", async () => {
  await supertest(app).get("/search/cities")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1) 
      expect(response.body.results[0]).toStrictEqual(results.CitiesRes)
    });
});


// Test the /search/cities with arguments
test("GET /search/cities args", async () => {
  await supertest(app).get("/search/cities?city=Los%20Angeles")
    .expect(200)
    .then((response) => {
      expect(response.body.results.length).toEqual(1) 
      expect(response.body.results[0]).toStrictEqual(results.CitiesRes2)
    });
});


