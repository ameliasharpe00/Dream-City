// All imports
import React, { useState } from 'react';
import MenuBar from '../components/MenuBar';
import BingMapsReact from "bingmaps-react";
import { Button, FormInput } from "shards-react";
import '../css_files/home_page.css';
import { getLonLat } from '../fetcher'

/*************************************
* MapPage file provides the user with
* possibility to find where cities are 
* located on the map with te use of 
* embedded Bing Maps.
**************************************/
export default function MapPage() {

  /*************************************
  * Function: This function changes the v
  * (query q representing city). 
  * params: event that stores the value
  * return: none
  **************************************/
 function changeQuery(event) {
    setV(event.target.value);
 }

  /*************************************
  * Function: This function changes the v
  * (query q representing state). 
  * params: event that stores the value
  * return: none
  **************************************/
 function changeQueryState(event) {
 	setState(event.target.value);
 }

  /*************************************
  * Function: After the button is clicked 
  * call backend function to get longitude
  * and latitutde information for the specified
  * city. If information is missing, throw an
  * alert.  
  * params: none
  * return: none
  **************************************/
  function clickedButton() {
    getLonLat(v, state).then(res => {
    	if (res.results.length != 0) {
    		setLat(res.results[0].lat)
    		setLon(res.results[0].lng)
    		const newArr = {
    			center: {
    				latitude: res.results[0].lat,
					longitude: res.results[0].lng,
    			},
    			options: {
    				title: v
    			}
    		}
    		setPushPin(newArr)
    	} else {
    		alert("Unfortunately no results have been found for your query :(")
    	}
    })
  }

  // Initializations of states for queries and results
  let [v, setV] = React.useState("Los Angeles");
  let [state, setState] = React.useState("California");

  let [lat, setLat] = React.useState(34.1139);

  let [lon, setLon] = React.useState(-118.4068);


  // Initialize pins for showing on the map
  let [pushPin, setPushPin] = React.useState({
	  center: {
	    latitude: 34.1139,
	    longitude: -118.4068,
	  },
	  options: {
	    title: "Los Angeles",
	  }
   })


  // Return styling for the entire page with search bar, maps and pins for the locations.
	return (
		<div>
			<div>
    		<MenuBar />
    			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh'}}>
    				<p> Which city (please also input state) would you like to locate on the map? </p>
    			</div>
    		    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh'}}>
			    <div style={{width: '50vw'}}>
			    <FormInput placeholder='Los Angeles' onChange={changeQuery} />
			    <FormInput placeholder='California' onChange={changeQueryState} />
			    </div>
			    </div>
                                          
      			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2vh' }}>
        			<Button style={{ marginTop: '4vh' }} onClick={clickedButton}>Search</Button>
    			</div>

			<div class='container' style = {{marginTop: '5vh'}}>
			<BingMapsReact bingMapsKey="AlbHqv-8R81knEPNserAqEjdLnVoVYCOorAVaxpb1qRyVLi1rTmOQNOuypFdHWkG" 
			pushPins={[pushPin]}
    		viewOptions={{ center: { latitude: lat, longitude: lon } }}/>
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh'}}>
			<p> </p> 
			</div>
    		</div>
    	</div>
	);
}