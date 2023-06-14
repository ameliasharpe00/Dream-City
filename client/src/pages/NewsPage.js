// All necessary imports
import React, { useState } from 'react';
import MenuBar from '../components/MenuBar';
import { FormInput } from "shards-react";
import { Button } from "shards-react";
import '../css_files/home_page.css';
import { Card } from 'antd';
const { Meta } = Card;

/*************************************
* NewsPage file provides the user with
* possibility to search for recent news
* about their favorite cities.
*************************************/
function NewsPage() {

  /*************************************
  * Function: This function changes the v
  * (temporary q which corresponds to
  * the city). 
  * params: event that stores the value
  * return: none
  **************************************/
  function changeQuery(event) {
    setV(event.target.value);
  }

  /*************************************
  * Function: Only after the button is 
  * clicked the information typed in the
  * search bar should be changed for query.
  * params: none
  * return: none
  **************************************/
  function clickedButton() {
    setQ(v)
  }

  // Initializations of states for queries and results
  let [v, setV] = React.useState("Los Angeles");

  let [q, setQ] = React.useState("Los Angeles");

  let [cityData, setCityData] = React.useState([]);

  // Call the NewsAPI to get results from our city query state q
  React.useEffect(
    function () {
      fetch(
        "https://newsapi.org/v2/everything?q=" +
        q +
        "&sortBy=relevancy&language=en&apiKey="
      )
        .then((res) => res.json())
        .then((answer) => setCityData(answer.articles));
    },
    [q]
  );


  /*************************************
  * Function: This function gives the user
  * card styling information.
  * return: card styling for the news
  * representation.
  **************************************/
  function NewsReact(props) {

    return (
      <div style={{ marginTop: '5vh' }} >
        <Card
          hoverable
          cover={<img alt="example" src={props.imageUrl} />}>
          <Meta className='title' title={props.title} description={props.description} />
          <p style={{ marginTop: '1vh' }}> {props.content} </p>
          <a href={props.link}>Details...</a>
        </Card>

      </div>
    );
  }

  // Initialize mapping of the data returned from the query to NewsReact cards.
  let bodyOfNews = cityData.map((item) => {
    return (
      <NewsReact
        title={item.title}
        description={item.description}
        content={item.content}
        link={item.url}
        imageUrl={item.urlToImage}
      />
    );
  });


  // Return styling for the entire page with cards for news and search bar.
  return (
    <div>
      <MenuBar />
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
          <p> What city do you want to read the news about? </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
          <div style={{ width: '50vw' }}>
            <FormInput placeholder='Los Angeles' onChange={changeQuery} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2vh' }}>
          <Button style={{ marginTop: '4vh' }} onClick={clickedButton}>Search</Button>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
        <div style={{ width: '50vw' }}>
          {bodyOfNews}
        </div>
      </div>
    </div>
  );

}


export default NewsPage
