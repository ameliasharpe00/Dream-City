// All the imports
import React from 'react';
import {
  Table,
  Pagination,
  Select
} from 'antd'
import '../css_files/home_page.css';
import MenuBar from '../components/MenuBar';
import { getAllMatches, getAllPlayers } from '../fetcher'

const { Column, ColumnGroup } = Table;
const { Option } = Select;

/*************************************
* HomePage file provides the user with
* basic information on our website. 
**************************************/
class HomePage extends React.Component {

  // Constructor is empty in this file because it is a static page with just website information.
  constructor(props) {
    super(props)

    this.state = {
    }

  }

/*************************************
* Function: rendering function to 
* display the website content 
* params: none
* return: Display navbar and basic
* website information
**************************************/
  render() {

  	// Display navbar and basic website information
    return (
      <div>
        <MenuBar />
	        <div style={{ backgroundImage: `url("https://images.unsplash.com/photo-1589481169991-40ee02888551?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80")` }}>
		        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0vh' }}></div>
			        <div>
			           <div class='text-on-image' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '50vh' }}>
			            <p> Dream City </p>
			          </div>

			          <div class = 'description' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10vh', marginRight: '60vh', marginLeft: '60vh'}}>
			            <p> This application allows you to find the city of your dreams based on the factors that matter to you such
			              as rent prices, pollution, proximity of your favorite cuisines. </p>
			          </div> 

			        </div>
			        <div style = {{marginTop : '30vh'}}> <p> .  
			        </p> </div>
		        </div>

	        </div> 
        
    )
  }

}

export default HomePage

