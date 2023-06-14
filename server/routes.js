/*************************************
* Routes file defines all of our SQL
* queries.
*************************************/

const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');
const { request } = require('./server');

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();


  /*************************************
  * Function: This function checks 
  * if our server is working properly.
  * If the name is provided, greet the 
  * user. If name is Dream City, ask if 
  * the user's name is the same as our folder.
  * Otherwise print a generic message.
  * params: req, res
  * return: none
  **************************************/
async function hello(req, res) {
    if (req.query.name && req.query.name != "Dream City") {
        const message = `Hello, ${req.query.name}! Welcome to the Dream City server!`
        res.send(message)
    } else if (req.query.name == "Dream City") { 
        const message = `Hello, is your name the same as our server's?`
        res.send(message)
    } else {
        const message = `Hello! Welcome to the Dream City server!`
        res.send(message)
    }
}


// ********************************************
//               GENERAL ROUTES
// ********************************************

  /*************************************
  * Function: Query that prints all 
  * the information from the city dataset.
  * params: req, res
  * return: none
  **************************************/
async function city(req, res) {
    connection.query(`
    SELECT * FROM City`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({
                results: results
            })
        }
    });
}

  /*************************************
  * Function: Query that gives us 
  * longitude and latitude based on city
  * and state.
  * params: req, res
  * return: none
  **************************************/
async function lon_lat(req, res) {
    var city;
    if (req.query.city) {
        city = req.query.city
    } else {
        city = 'Los Angeles'
    }
    var state;
    if (req.query.state) {
        state = req.query.state
    } else {
        state = 'California'
    }
    connection.query(`SELECT lat, lng FROM City WHERE city = '${city}' AND state = '${state}'`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}


  /*************************************
  * Function: Query that gives us 
  * all the information about a specific 
  * city.
  * params: req, res
  * return: none
  **************************************/
async function search_cities(req, res) {
    var city;
    if (req.query.city) {
        city = req.query.city
    } else {
        city = 'San Francisco'
    }
    connection.query(`SELECT * FROM City WHERE city = '${city}'`, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Query that gives us 
  * cities that contain restaurants
  * with the specified cuisine.
  * params: req, res
  * return: none
  **************************************/
async function get_cuisine(req, res) {
    var cuisine;
    if (req.query.cuisine) {
        cuisine = req.query.cuisine
    } else {
        cuisine = 'French'
    }
    connection.query(`
        WITH cityCuisine (city, state, cuisine) AS (
            (SELECT DISTINCT C.city, C.state, VR.cuisine
            FROM City C JOIN VegeRestaurant VR ON C.city=VR.city
            WHERE (VR.cuisine LIKE '%${cuisine}%')
            AND ABS (C.lat - VR.latitude) <= 0.5
            AND ABS (C.lng - VR.longitude) <= 0.5)
            UNION
            (SELECT DISTINCT C.city, C.state, MR.cuisine
            FROM City C JOIN MichelinRestaurant MR ON C.city=MR.city
            WHERE (MR.cuisine LIKE '%${cuisine}%' AND MR.country='United States')
            AND ABS (C.lat - MR.latitude) <= 0.5
            AND ABS (C.lng - MR.longitude) <= 0.5)
        )
        SELECT DISTINCT C.city, C.state
        FROM cityCuisine C
        GROUP BY C.city, C.state
        ORDER BY COUNT(*) DESC;
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Query that gives us 
  * cities that are within budget.
  * params: req, res
  * return: none
  **************************************/
async function get_city_by_budget(req, res) {
    var budget;
    if (req.query.budget && !isNaN(req.query.budget) && req.query.budget > 0) {
        budget = req.query.budget
    } else {
        budget = 4000
    }
    connection.query(`
        WITH costAverages (city, neighborhood, price_per_night) AS (
            SELECT A.city, A.neighborhood_group, ROUND(AVG(A.price_per_night), 2) AS price
            FROM
            (SELECT city, neighborhood_group, price_per_night
            FROM Airbnb
            UNION
            SELECT city, neighborhood_group, price_per_night
            FROM Airbnb_2) A
            WHERE A.price_per_night * 30  <= '${budget}' AND NOT neighborhood_group='Other Cities'
            GROUP BY city, neighborhood_group
        ) SELECT * FROM costAverages WHERE city NOT LIKE '%,%' ORDER BY price_per_night DESC;
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Query that gives us 
  * N cities that are the cleanest.
  * params: req, res
  * return: none
  **************************************/
async function get_city_by_AQI(req, res) {
    var N;
    if (!isNaN(req.query.n) && req.query.n > 0) {
        N = req.query.n;
    } else if (N < 0) {
        N = 10;
    } else {
        N = 10; 
    }
    connection.query(`
    WITH cityPol (city, state, SO2_AQI, NO2_AQI, CO_AQI) AS (
        SELECT P.city, P.state, AVG(P.SO2_AQI), AVG(NO2_AQI), AVG(CO_AQI)
         FROM PollutionInfo P
         GROUP BY P.city
     )
     SELECT DISTINCT P.city, P.state
     FROM cityPol P
     WHERE NOT city='Not in a city' AND city NOT LIKE '%,%'
     ORDER BY P.NO2_AQI, P.SO2_AQI, P.CO_AQI
     LIMIT ${N}; 
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}


  /*************************************
  * Function: Query that gives us 
  * vegetarian friendly restaurants.
  * params: req, res
  * return: none
  **************************************/
async function get_veggie_cities(req, res) {
    connection.query(`
        SELECT C.city, C.state
        FROM VegeRestaurant VR JOIN City C on VR.city = C.city
        WHERE ABS (C.lat - VR.latitude) <= 0.5 AND ABS (C.lng - VR.longitude) <= 0.5  AND VR.city NOT LIKE '%,%'
        GROUP BY C.city
        ORDER BY COUNT(DISTINCT restaurant_id) DESC
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}


  /*************************************
  * Function: Query that gives us 
  * cities with restaurants that earned 
  * a Michelin star.
  * params: req, res
  * return: none
  **************************************/
async function get_mich_cities(req, res) {
    connection.query(`
    WITH cityMichelin (city, state, count) AS (
        SELECT DISTINCT C.city, C.state, COUNT(*)
        FROM MichelinRestaurant MR
            JOIN City C
                ON (C.city=MR.city)
        WHERE ABS(C.lat - MR.latitude) <= 0.5 AND ABS(C.lng - MR.longitude) <= 0.5 AND MR.country='United States'
        GROUP BY C.city, C.state
    )
    SELECT C.city, C.state
    FROM cityMichelin C
    WHERE C.count > 0 AND C.city NOT LIKE '%,%'
    ORDER BY C.count DESC;
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}


  /*************************************
  * Function: Query that gives us 
  * cities with the specified room type.
  * params: req, res
  * return: none
  **************************************/
async function get_room_type_cities(req, res) {
    var room;
    if (req.query.room) {
        room = req.query.room
    } else {
        room = 'Private room'
    }
    connection.query(`
        SELECT city, neighborhood_group AS neighborhood
        FROM (SELECT * FROM Airbnb UNION SELECT * FROM Airbnb_2) A
        WHERE room_type='${room}' AND city NOT LIKE '%,%'
        GROUP BY city, neighborhood_group
        ORDER BY COUNT(DISTINCT id) DESC;
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Out of all cities, which 
  * have the highest number of schools 
  * and vegetarian (insert cuisine) 
  * restaurants where the AQI index 
  * is appropriately low? The cost of living 
  * should appropriate.
  * params: req, res
  * return: none
  **************************************/
async function filter_cities(req, res) {
    var NO2_AQI;
    if (!isNaN(req.query.NO2_AQI) && req.query.NO2_AQI > 0) {
        NO2_AQI = parseInt(req.query.NO2_AQI);
    } else {
        NO2_AQI = 80;
    }

    var SO2_AQI;
    if (!isNaN(req.query.SO2_AQI) && req.query.SO2_AQI > 0) {
        SO2_AQI = parseInt(req.query.SO2_AQI)
    } else {
        SO2_AQI = 80;
    }

    var CO_AQI;
    if (!isNaN(req.query.CO_AQI) && req.query.CO_AQI > 0) {
        CO_AQI = parseInt(req.query.CO_AQI)
    } else {
        CO_AQI = 80
    }
    const cuisine = req.query.cuisine ? req.query.cuisine : 'French';
    const price_per_night = !isNaN(req.query.price_per_night) ? parseInt(req.query.price_per_night) : 2000;
    connection.query(`

    WITH cityCuisine (city, state, cuisine) AS (
        (SELECT DISTINCT C.city, C.state, VR.cuisine
        FROM City C JOIN VegeRestaurant VR ON C.city=VR.city
        WHERE (VR.cuisine LIKE '${'%' + cuisine + '%'}')
        AND ABS (C.lat - VR.latitude) <= 0.5
        AND ABS (C.lng - VR.longitude)<= 0.5)
        UNION
        (SELECT DISTINCT C.city, C.state, MR.cuisine
        FROM City C JOIN MichelinRestaurant MR ON C.city=MR.city
        WHERE (MR.cuisine LIKE '${'%' + cuisine + '%'}' AND MR.country='United States')
        AND ABS (C.lat - MR.latitude) <= 0.5
        AND ABS (C.lng - MR.longitude)<= 0.5)
    )
    SELECT DISTINCT C.city, C.state
    FROM cityCuisine C
    JOIN (
    SELECT DISTINCT S.city, S.state, COUNT(*) AS num_schools
        FROM (SELECT S.city, S.state FROM SchoolLocation S) S
        GROUP BY S.City
    ) S
        ON C.city=S.city
    JOIN (
        SELECT DISTINCT city,
                        state,
                        AVG(SO2_AQI) AS SO2_AQI,
                        AVG(NO2_AQI) AS NO2_AQI,
                        AVG(CO_AQI) AS CO_AQI
        FROM PollutionInfo
        GROUP BY city, state
    ) P
        ON P.city=C.city
    JOIN (
        SELECT A.city, AVG(price_per_night)
        FROM ( (SELECT A.city, A.price_per_night
                FROM Airbnb A
                WHERE A.price_per_night < '${price_per_night}')
                UNION
                (SELECT A.city, A.price_per_night
                FROM Airbnb_2 A
                WHERE A.price_per_night < '${price_per_night}') ) A
                GROUP BY A.city
        ) M
        ON C.city=M.city
    WHERE (P.SO2_AQI < '${SO2_AQI}' AND P.NO2_AQI < '${NO2_AQI}' AND P.CO_AQI < '${CO_AQI}')  AND C.city NOT LIKE '%,%'
    GROUP BY C.city, C.state
    ORDER BY COUNT(*) DESC, COUNT(S.num_schools) DESC
    LIMIT 5;
    `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Query that gives us 
  * a list of cities that are a top city in 
  NO2 pollution AND/OR S02 pollution 
  * AND/OR a top city in CO pollution.
  * params: req, res
  * return: none
  **************************************/
async function get_top50_polluted_cities(req, res) {
    connection.query(`
    
    SELECT city, state 
    FROM (SELECT city, state, AVG(SO2_AQI)
          FROM PollutionInfo
          WHERE NOT city='Not in a city'  AND city NOT LIKE '%,%'
          AND SO2_AQI > 70
          GROUP BY city, state
          ORDER BY AVG(SO2_AQI) DESC
          LIMIT 50) so2
    UNION
    SELECT city, state 
    FROM (SELECT city, state, AVG(NO2_AQI)
          FROM PollutionInfo
          WHERE NOT city='Not in a city' AND NO2_AQI > 70 AND city NOT LIKE '%,%'
          GROUP BY city, state
          ORDER BY AVG(NO2_AQI) DESC
          LIMIT 50) no2
    UNION
    SELECT city, state 
    FROM (SELECT city, state, AVG(CO_AQI)
          FROM PollutionInfo
          WHERE NOT city='Not in a city' AND CO_AQI > 70 AND city NOT LIKE '%,%'
          GROUP BY city, state
          ORDER BY AVG(CO_AQI) DESC
          LIMIT 50) co;

        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Query that gives us 
  * cities with schools info.
  * params: req, res
  * return: none
  **************************************/
async function get_youth_ratio(req, res) {

    connection.query(`

    SELECT C.city, C.state, COUNT(IF(SL.is_private = 1, SL.Objectid, NULL)) AS private_count, COUNT(IF(SL.is_private = 0, SL.Objectid, NULL)) AS public_count
FROM  (SELECT city, state, population FROM City) C
INNER JOIN (SELECT SchoolLocation.Objectid, SchoolLocation.city, SC.state, SchoolLocation.is_private FROM SchoolLocation JOIN StateCodes SC on SchoolLocation.state = SC.code) SL ON (C.city = SL.city AND SL.state = C.state)
INNER JOIN (SELECT Objectid, population, is_private FROM SchoolStats) SS ON (SL.Objectid = SS.Objectid AND SL.is_private = SS.is_private)
GROUP BY SL.city, SL.state, C.population
ORDER BY  SUM(SS.population) / C.population DESC;

    
        
        `, function (error, results, fields) {
        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            const resultAnswer = results
            res.json({ results: resultAnswer })
        }
    });
}

  /*************************************
  * Function: Out of all restaurants in 
  * cities where the AQI indexes are less
  * than X, find the restaurants that happen to be 
  * vegan, but not Michelin star, 
  * and where the stay per night is less than D dollars.
  * params: req, res
  * return: none
  **************************************/
async function filter_restauraunts(req, res) {
    var NO2_AQI;
    if (!isNaN(req.query.NO2_AQI)) {
        NO2_AQI = parseInt(req.query.NO2_AQI);
    } else {
        NO2_AQI = 100;
    }

    var SO2_AQI;
    if (!isNaN(req.query.SO2_AQI)) {
        SO2_AQI = parseInt(req.query.SO2_AQI)
    } else {
        SO2_AQI = 100;
    }

    var CO_AQI;
    if (!isNaN(req.query.CO_AQI)) {
        CO_AQI = parseInt(req.query.CO_AQI)
    } else {
        CO_AQI = 100
    }
    const isMichelin = !isNaN(req.query.isMichelin) ? parseInt(req.query.isMichelin) : -1;
    const price_per_night = !isNaN(req.query.price_per_night) ? parseInt(req.query.price_per_night) : 2000;
    if (isMichelin == 1) {
        connection.query(`
            SELECT DISTINCT R.name, P.city, P.state
            FROM (
                (SELECT DISTINCT VR.name, C.city, C.state
                FROM City C
                    JOIN VegeRestaurant VR
                        ON C.city=VR.city
                    WHERE (ABS (C.lat - VR.latitude) <= 0.5
                    AND ABS (C.lng - VR.longitude) <= 0.5))
                    UNION
                (SELECT DISTINCT MR.name, C.city, C.state
                FROM City C
                    JOIN MichelinRestaurant MR
                        ON C.city=MR.city
                    WHERE (ABS (C.lat - MR.latitude) <= 0.5
                    AND ABS (C.lng - MR.longitude)<= 0.5) AND MR.country='United States')
                ) R
                JOIN (
                    SELECT P.city, P.state,
                        AVG(P.SO2_AQI) AS SO2_AQI,
                        AVG(NO2_AQI) AS NO2_AQI,
                        AVG(CO_AQI) AS CO_AQI
                    FROM PollutionInfo P
                    GROUP BY P.city
                ) P
                    ON P.city=R.city
                JOIN ( (SELECT A.city, A.price_per_night 
                        FROM Airbnb A 
                        WHERE A.price_per_night < '${price_per_night}')
                    UNION (SELECT A.city, A.price_per_night 
                        FROM Airbnb_2 A 
                        WHERE A.price_per_night < '${price_per_night}') ) A
                    ON P.city=A.city
                    WHERE P.SO2_AQI < '${SO2_AQI}' 
                    AND P.NO2_AQI < '${NO2_AQI}' 
                    AND P.CO_AQI < '${CO_AQI}' AND P.city NOT LIKE '%,%';
        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                const resultAnswer = results
                res.json({ results: resultAnswer })
            }
        });
    } else { // No michelin!
        connection.query(`

            SELECT DISTINCT VCP.name, P.city, P.state
            FROM (SELECT VR.city, VR.name, VR.address
                FROM City C 
                    JOIN VegeRestaurant VR 
                        ON C.city=VR.city
                WHERE (ABS (C.lat - VR.latitude) <= 0.5
                AND ABS (C.lng - VR.longitude)<= 0.5)
                AND VR.name NOT IN (
                    (SELECT MR.name
                    FROM MichelinRestaurant MR)
                ) ) VCP
                JOIN (
                    SELECT P.city, P.state,
                        AVG(P.SO2_AQI) AS SO2_AQI,
                        AVG(NO2_AQI) AS NO2_AQI,
                        AVG(CO_AQI) AS CO_AQI
                    FROM PollutionInfo P
                    GROUP BY P.city
                ) P
                    ON P.city=VCP.city
                JOIN ( (SELECT A.city, A.price_per_night FROM Airbnb A WHERE A.price_per_night < '${price_per_night}')
                    UNION (SELECT A.city, A.price_per_night FROM Airbnb_2 A WHERE A.price_per_night < '${price_per_night}') ) A
                    ON P.city=A.city
            WHERE P.SO2_AQI < '${SO2_AQI}' 
                AND P.NO2_AQI < '${NO2_AQI}' 
                AND P.CO_AQI < '${CO_AQI}';

        `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                const resultAnswer = results
                res.json({ results: resultAnswer })
            }
        });
    }
}

// All the exports
module.exports = {
    hello,
    city,
    search_cities,
    get_veggie_cities,
    get_mich_cities,
    get_room_type_cities,
    get_cuisine,
    get_city_by_budget,
    get_city_by_AQI,
    filter_cities,
    filter_restauraunts,
    get_top50_polluted_cities,
    get_youth_ratio,
    lon_lat
}