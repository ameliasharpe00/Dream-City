// All necessary imports
import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,
    Select,
    Slider,
    Radio,
    Space

} from 'antd'
import { getCuisineSearch, getBudgetSearch, getRoomSearch, getCityFilter, getRestaurantFilter } from '../fetcher'
import '../css_files/home_page.css';
import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;
const { Option } = Select;

/*************************************
* FilterPage file provides the user with
* possibility to find cities based on 
* their preferences. With the use of
* backend queries and our cleaned
* datasets they can get recommendations
* based on their budget, favorite cuisines,
* pollution tolerance. 
**************************************/


/*************************************
* Function: This function formats 
* the hovered information over the 
* slider for monthly value of the 
* budget.
* params: value (from 0 - 100)
* return: equivalent value for 
* the budget. Conversion from 0 - 100
* to 0 - 30,000.
**************************************/
function formater_budget(value) {
    return `$ ${value * 300}`;
}


/*************************************
* Function: This function formats 
* the hovered information over the 
* slider for nightly budget.
* params: value (from 0 - 100)
* return: equivalent value for 
* the budget. Conversion from 0 - 100
* to 0 - 1,000.
**************************************/
function formater_night_budget(value) {
    return `$ ${value * 10}`;
}


/*************************************
* Function: This function formats 
* the hovered information over the 
* slider for air quality index.
* params: value (from 0 - 100)
* return: equivalent value for 
* the budget. Conversion from 0 - 100
* to 0 - 250.
**************************************/
function formater_AQI(value) {
    return ` ${value * 2.5}`;
}

/*************************************
* This variable holds marks for the
* budget slider that are displayed 
* for the user.
**************************************/
const marks = {
    1: '$300',
    5: '$1,500',
    10: '$3,000',
    25: '$7,500',
    50: '$15,000',
    75: '$22,500',
    100: '$30,000'
};


/*************************************
* This variable holds marks for the
* daily budget slider that are displayed 
* for the user.
**************************************/
const marks_budget_daily = {
    1: '$10',
    5: '$50',
    10: '$100',
    25: '$250',
    50: '$500',
    75: '$750',
    100: '$1,000'
};

/*************************************
* This variable holds marks for the
* AQI slider that are displayed 
* for the user.
**************************************/
const marks_AQI = {
    10: '25',
    25: '62.5',
    50: '125',
    75: '187.5',
    100: '250'
};


/*************************************
* Store the columns for the cuisine
* table.
**************************************/
const cuisineColumns = [
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    }
];


/*************************************
* Store the columns for the budget
* table.
**************************************/
const budgetColumns = [
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'Neighborhood group',
        dataIndex: 'neighborhood',
        key: 'neighborhood'
    },
    {
        title: 'Average night cost',
        dataIndex: 'price_per_night',
        key: 'price_per_night'
    }
];

/*************************************
* Store the columns for the room
* table.
**************************************/
const roomColumns = [
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'Neighborhood',
        dataIndex: 'neighborhood',
        key: 'neihborhood'
    }
];

/*************************************
* Store the columns for the restaurants
* table.
**************************************/
const restaurantColumns = [
    {
        title: 'Name of the restaurant',
        dataIndex: 'name',
        key: 'name'
    },
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    }
];

/*************************************
* Store the columns for the city filter
* table.
**************************************/
const cityFilterColumns = [
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    }
]

class FilterPage extends React.Component {
    /*************************************
    * Constructor sets all the state fields
    * and binds the functions necessary
    * for this file.
    **************************************/
    constructor(props) {
        super(props)
        this.state = {
            option_is: '0', // 0 - option 0th from drop_down chosen, 1 - option 1st, 2 - option 2nd, etc.
            queryResults0: [], // query results for option 0
            queryResults1: [], // query results for option 1
            queryResults2: [], // query results for option 2
            queryResults3: [], // query results for option 3
            queryResults4: [], // query results for option 4
            cuisine: 'French', // cuisine state
            budget: 1, // budget state
            room_type: 0, // 0 - private room, 1 - entire home or apartment, 2 - shared rom, 3 - hotel room
            // initialize all AQI states
            NO2_AQI: 1,
            CO_AQI: 1,
            SO2_AQI: 1,
            is_Mich: 1 // 1 if we want it to include Michelin and -1 if not
        }

        // Bind all the functions
        this.dropOnChange = this.dropOnChange.bind(this)
        this.handleCuisineQueryChange = this.handleCuisineQueryChange.bind(this)
        this.updateSearchResultsCuisine = this.updateSearchResultsCuisine.bind(this)
        this.handleBudgetChange = this.handleBudgetChange.bind(this)
        this.updateSearchResultsBudget = this.updateSearchResultsBudget.bind(this)
        this.updateSearchPrivateRoom = this.updateSearchPrivateRoom.bind(this)
        this.updateSearchEntirePlace = this.updateSearchEntirePlace.bind(this)
        this.updateSearchSharedRoom = this.updateSearchSharedRoom.bind(this)
        this.updateSearchHotelRoom = this.updateSearchHotelRoom.bind(this)
        this.handleNO2Change = this.handleNO2Change.bind(this)
        this.handleSO2Change = this.handleSO2Change.bind(this)
        this.handleCOChange = this.handleCOChange.bind(this)
        this.updateSearchResultsFilterCities = this.updateSearchResultsFilterCities.bind(this)
        this.handleMichelinStars = this.handleMichelinStars.bind(this)
        this.updateSearchResultsFilterRestaurants = this.updateSearchResultsFilterRestaurants.bind(this)
        this.handleMonthlyBudgetChange = this.handleMonthlyBudgetChange.bind(this)
    }

    /*************************************
    * Function: Calls getRestaurantFilter
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchResultsFilterRestaurants() {
        getRestaurantFilter(this.state.NO2_AQI, this.state.SO2_AQI, this.state.CO_AQI, this.state.is_Mich, this.state.budget).then(res => {
            this.setState({ queryResults4: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getCityFilter
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchResultsFilterCities() {
        getCityFilter(this.state.NO2_AQI, this.state.SO2_AQI, this.state.CO_AQI, this.state.cuisine, this.state.budget).then(res => {
            this.setState({ queryResults3: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getRoomSearch 
    * query from the backend with hotel room 
    * as the paramater to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchHotelRoom() {
        getRoomSearch("Hotel room").then(res => {
            this.setState({ queryResults2: res.results })
            this.setState({ room_type: 3 })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getRoomSearch 
    * query from the backend with shared room 
    * as the paramater to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchSharedRoom() {
        getRoomSearch("Shared room").then(res => {
            this.setState({ queryResults2: res.results })
            this.setState({ room_type: 2 })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getRoomSearch 
    * query from the backend with entire home 
    * as the paramater to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchEntirePlace() {
        getRoomSearch("Entire home/apt").then(res => {
            this.setState({ queryResults2: res.results })
            this.setState({ room_type: 1 })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getRoomSearch 
    * query from the backend with private room 
    * as the paramater to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchPrivateRoom() {
        getRoomSearch("Private room").then(res => {
            this.setState({ queryResults2: res.results })
            this.setState({ room_type: 0 })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getBudgetSearch 
    * query from the backend with budget
    * as the paramater to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchResultsBudget() {
        getBudgetSearch(this.state.budget).then(res => {
            this.setState({ queryResults1: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getRoomSearch 
    * query from the backend with current cuisine
    * as the paramater to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateSearchResultsCuisine() {
        getCuisineSearch(this.state.cuisine).then(res => {
            this.setState({ queryResults0: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Changes the value of CO_AQI
    * variable. It is normalized by 2.5 to
    * reflect 0 - 250 scale.
    * params: value to set CO_AQI to
    * return: none
    **************************************/
    handleCOChange(value) {
        this.setState({ CO_AQI: value * 2.5 })
    }

    /*************************************
    * Function: Changes the value of SO2_AQI
    * variable. It is normalized by 2.5 to
    * reflect 0 - 250 scale.
    * params: value to set SO2_AQI to
    * return: none
    **************************************/
    handleSO2Change(value) {
        this.setState({ SO2_AQI: value * 2.5 })
    }

    /*************************************
    * Function: Changes the value of NO2_AQI
    * variable. It is normalized by 2.5 to
    * reflect 0 - 250 scale.
    * params: value to set NO2_AQI to
    * return: none
    **************************************/
    handleNO2Change(value) {
        this.setState({ NO2_AQI: value * 2.5 })
    }

    /*************************************
    * Function: Changes the value of budget
    * variable. It is normalized by 300 to
    * reflect 0 - 30,000 scale.
    * params: value to set budget to
    * return: none
    **************************************/
    handleBudgetChange(value) {
        this.setState({ budget: value * 300 })
    }

    /*************************************
    * Function: Changes the value of budget
    * variable. It is normalized by 10 to
    * reflect 0 - 1,000 scale.
    * params: value to set budget to
    * return: none
    **************************************/
    handleMonthlyBudgetChange(value) {
        this.setState({ budget: value * 10 })
    }

    /*************************************
    * Function: Changes the value of cuisine
    * variable.
    * params: event that stores values
    * return: none
    **************************************/
    handleCuisineQueryChange(event) {
        this.setState({ cuisine: event.target.value })
    }

    /*************************************
    * Function: Changes the value of Michelin
    * star variable.
    * params: event that stores values
    * return: none
    **************************************/
    handleMichelinStars(event) {
        this.setState({ is_Mich: event.target.value })
    }

    /*************************************
    * Function: Changes the value of dropdown
    * option variable.
    * params: value to store
    * return: none
    **************************************/
    dropOnChange(value) {
        this.setState({ option_is: value });
    }

    /*************************************
    * Function: Calls backend queries upon 
    * loading.
    * params: none
    * return: none
    **************************************/
    componentDidMount() {
        // Based on the current option and choices, call the necessary queries with their respective
        // paramaters.
        if (this.state.option_is == '0') {
            getCuisineSearch(this.state.cuisine).then(res => {
                this.setState({ queryResults0: res.results })
            })
        } else if (this.state.option_is == '1') {
            getBudgetSearch(this.state.budget).then(res => {
                this.setState({ queryResults1: res.results })
            })
        } else if (this.state.option_is == '2') {
            if (this.state.room_type == 0) {
                getRoomSearch("Private room").then(res => {
                    this.setState({ queryResults2: res.results })
                })
            } else if (this.state.room_type == 1) {
                getRoomSearch("Entire home/apt").then(res => {
                    this.setState({ queryResults2: res.results })
                })
            } else if (this.state.room_type == 2) {
                getRoomSearch("Shared room").then(res => {
                    this.setState({ queryResults2: res.results })
                })
            } else if (this.state.room_type == 3) {
                getRoomSearch("Hotel room").then(res => {
                    this.setState({ queryResults2: res.results })
                })
            } else {
                getRoomSearch("Private room").then(res => {
                    this.setState({ queryResults2: res.results })
                })
            }
        } else if (this.state.option_is == '3') {
            getCityFilter(this.state.NO2_AQI, this.state.SO2_AQI, this.state.CO_AQI, this.state.cuisine, this.state.budget).then(res => {
                this.setState({ queryResults3: res.results })
            })
        } else if (this.state.option_is == '4') {
            getRestaurantFilter(this.state.NO2_AQI, this.state.SO2_AQI, this.state.CO_AQI, this.state.is_Mich, this.state.budget).then(res => {
                this.setState({ queryResults4: res.results })
            })
        }
    }

    /*************************************
    * Function: Display the website content 
    * based on user's dropdown choice. 
    * Calls functions defined above on changes.
    * params: none
    * return: none
    **************************************/
    render() {
        const option_is = this.state.option_is;
        return (
            <div>
                <MenuBar />
                <div style={{ backgroundImage: `url("https://images.unsplash.com/flagged/photo-1575555201693-7cd442b8023f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2064&q=80")` }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0vh' }}></div>
                    <div class='filter-white' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                        <p> Please choose from the dropdown menu what matters to you when choosing your dream city. </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                        <Select defaultValue="Proximity of restaurants with my favorite cusines! I'm a big foodie." style={{ width: 600 }} onChange={this.dropOnChange}>
                            <Option value='0'>Proximity of restaurants with my favorite cusines! I'm a big foodie.</Option>
                            <Option value='1'>I want to find something within my budget.</Option>
                            <Option value='2'>I am set on what type of room I need.</Option>
                            <Option value='3'>Looking for a whole package— level of pollution, cuisines close by, and my budget.</Option>
                            <Option value='4'>Want a full package but restaurant oriented.</Option>
                        </Select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                        {option_is == '0'
                            ?
                            <div class='filter-white'>
                                <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                                    <Row>
                                        <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto' }}>
                                            <label>What cuisines do you like? (I recommend checking out French, Thai, or American)</label>
                                            <FormInput placeholder='Cuisine' value={this.state.cuisine} onChange={this.handleCuisineQueryChange} />

                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                                                <Button style={{ marginTop: '4vh' }} onClick={this.updateSearchResultsCuisine}>Search</Button>
                                            </div>

                                        </FormGroup></Col>
                                    </Row>
                                    <br></br>
                                </Form>
                                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                    <Table dataSource={this.state.queryResults0} columns={cuisineColumns} />
                                </div>
                            </div>
                            : option_is == '1' ?
                                <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto' }}>
                                    <label class='filter-white'>What's your budget per month?</label>
                                    <Slider tipFormatter={formater_budget} defaultValue={1} marks={marks} onChange={this.handleBudgetChange} />

                                </FormGroup>
                                    <Button style={{ marginTop: '4vh', marginLeft: '5vh' }} onClick={this.updateSearchResultsBudget}>Search</Button>
                                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                        <Table dataSource={this.state.queryResults1} columns={budgetColumns} />
                                    </div>
                                </Col>
                                : option_is == '2' ?
                                    <div>
                                        <div style={{ width: '70vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <Button style={{ marginTop: '4vh', marginLeft: '5vh' }} onClick={this.updateSearchPrivateRoom} >Private Room</Button>
                                            <Button style={{ marginTop: '4vh', marginLeft: '5vh' }} onClick={this.updateSearchEntirePlace} >Entire home or apartment</Button>
                                            <Button style={{ marginTop: '4vh', marginLeft: '5vh' }} onClick={this.updateSearchSharedRoom} >Shared room</Button>
                                            <Button style={{ marginTop: '4vh', marginLeft: '5vh' }} onClick={this.updateSearchHotelRoom} >Hotel room</Button>
                                        </div>
                                        <Table dataSource={this.state.queryResults2} columns={roomColumns} style={{ marginTop: '5vh' }} />
                                    </div>
                                    : option_is == '3' ?
                                        <div>
                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto' }}>
                                                <label class='filter-white'>What's your budget per night?</label>
                                                <Slider tipFormatter={formater_night_budget} defaultValue={1} marks={marks_budget_daily} onChange={this.handleMonthlyBudgetChange} />

                                            </FormGroup>

                                            </Col>
                                            <Row>
                                                <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto', marginTop: '5vh' }}>
                                                    <label class='filter-white'>What cuisines do you like? (I recommend checking out Indian)</label>
                                                    <FormInput placeholder='Cuisine' value={this.state.cuisine} onChange={this.handleCuisineQueryChange} />

                                                </FormGroup></Col>
                                            </Row>
                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto', marginTop: '5vh' }}>
                                                <label class='filter-white2'>What's maximum value of NO2 AQI you are willing to tolerate? 0 - 50 means good air quality, 51 - 100 moderate, 101-150 unhealthy for sensitive groups, 151 - 200 unhealthy, 201 - 300 very unhealthy, 301+ hazardous.</label>
                                                <Slider tipFormatter={formater_AQI} defaultValue={1} marks={marks_AQI} onChange={this.handleNO2Change} />

                                            </FormGroup>

                                            </Col>
                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto', marginTop: '5vh' }}>
                                                <label class='filter-white2'>What's maximum value of SO2 AQI you are willing to tolerate? 0 - 50 means good air quality, 51 - 100 moderate, 101-150 unhealthy for sensitive groups, 151 - 200 unhealthy, 201 - 300 very unhealthy, 301+ hazardous.</label>
                                                <Slider tipFormatter={formater_AQI} defaultValue={1} marks={marks_AQI} onChange={this.handleSO2Change} />

                                            </FormGroup>

                                            </Col>
                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto', marginTop: '5vh' }}>
                                                <label class='filter-white2'>What's maximum value of CO AQI you are willing to tolerate? 0 - 50 means good air quality, 51 - 100 moderate, 101-150 unhealthy for sensitive groups, 151 - 200 unhealthy, 201 - 300 very unhealthy, 301+ hazardous.</label>
                                                <Slider tipFormatter={formater_AQI} defaultValue={1} marks={marks_AQI} onChange={this.handleCOChange} />

                                            </FormGroup>

                                            </Col>
                                            <Col flex={2}><FormGroup style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                                                <Button style={{ marginTop: '4vh', marginLeft: '5vh' }} onClick={this.updateSearchResultsFilterCities}>Search</Button>
                                            </FormGroup></Col>
                                            <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                                <Table dataSource={this.state.queryResults3} columns={cityFilterColumns} />
                                            </div>
                                        </div>
                                        :
                                        <div>
                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto', marginTop: '5vh' }}>
                                                <label class='filter-white'>What's maximum value of NO2 AQI you are willing to tolerate? 0 - 50 means good air quality, 51 - 100 moderate, 101-150 unhealthy for sensitive groups, 151 - 200 unhealthy, 201 - 300 very unhealthy, 301+ hazardous.</label>
                                                <Slider tipFormatter={formater_AQI} defaultValue={1} marks={marks_AQI} onChange={this.handleNO2Change} />

                                            </FormGroup>

                                            </Col>

                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto', marginTop: '5vh' }}>
                                                <label class='filter-white2'>What's maximum value of SO2 AQI you are willing to tolerate? 0 - 50 means good air quality, 51 - 100 moderate, 101-150 unhealthy for sensitive groups, 151 - 200 unhealthy, 201 - 300 very unhealthy, 301+ hazardous.</label>
                                                <Slider tipFormatter={formater_AQI} defaultValue={1} marks={marks_AQI} onChange={this.handleSO2Change} />
                                            </FormGroup>

                                            </Col>

                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto', marginTop: '5vh' }}>
                                                <label class='filter-white2'>What's maximum value of CO AQI you are willing to tolerate? 0 - 50 means good air quality, 51 - 100 moderate, 101-150 unhealthy for sensitive groups, 151 - 200 unhealthy, 201 - 300 very unhealthy, 301+ hazardous.</label>
                                                <Slider tipFormatter={formater_AQI} defaultValue={1} marks={marks_AQI} onChange={this.handleCOChange} />

                                            </FormGroup>

                                            </Col>

                                            <Col flex={2}><FormGroup style={{ width: '95vw', margin: '0 auto' }}>
                                                <label class='filter-white2'>What's your budget per night?</label>
                                                <Slider tipFormatter={formater_night_budget} defaultValue={1} marks={marks_budget_daily} onChange={this.handleMonthlyBudgetChange} />

                                            </FormGroup>

                                            </Col>

                                            <Row style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                                                <p class='filter-white2'>How important is it for you that the restaurants earned Michelin stars? </p> </Row>

                                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1vh' }}>
                                                <Row>
                                                    <div class='multiple_choice'>
                                                        <Radio.Group onChange={this.handleMichelinStars}>
                                                            <Space direction="vertical">
                                                                <Radio value={1}>I want to have restaurants that earned them included.</Radio>
                                                                <Radio value={-1}>I don't care about Michelin stars, please don't include them.</Radio>
                                                            </Space>
                                                        </Radio.Group>
                                                    </div>
                                                </Row>
                                                <Row>
                                                    <Button onClick={this.updateSearchResultsFilterRestaurants}>Search</Button>
                                                </Row>
                                            </div>

                                            <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>


                                                <Table dataSource={this.state.queryResults4} columns={restaurantColumns} />
                                            </div>
                                        </div>



                        }
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '30vh' }}> <p>  </p> </div>
                </div>

            </div>

        )
    }
}


export default FilterPage

