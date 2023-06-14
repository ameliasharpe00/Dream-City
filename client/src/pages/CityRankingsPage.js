import React from 'react';
import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,
    Select,
    Slider
} from 'antd'
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";
import { getMichCities, getVeggieCities, getAqiCities, getTop50Polluted, getYouthRatio } from '../fetcher'
import '../css_files/home_page.css';
import MenuBar from '../components/MenuBar';
const { Column, ColumnGroup } = Table;

const { Option } = Select;

/*************************************
* Create columns that store the results
* of the queries that select both the
* city and state attribute
**************************************/
const cityStateColumns = [
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
* Create columns that store the results
* of the Michelin query:
* (city, state, number of michelin restaurants)
**************************************/
const michColumns = [
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
* Create columns that store the results
* of the youthRatio query
**************************************/
const schoolColumns = [
    {
        title: 'City',
        dataIndex: 'city',
        key: 'city'
    },
    {
        title: 'State',
        dataIndex: 'state',
        key: 'state'
    },
    {
        title: 'Number of Private Schools',
        dataIndex: 'private_count',
        key: 'private_count'
    },
    {
        title: 'Number of Public Schools',
        dataIndex: 'public_count',
        key: 'public_count'
    }
]

/* City Rankings is the third page on the website
 * Users can rank cities based on criterait such as availability
 * of schools or number of restaurants
 */
class CityRankingsPage extends React.Component {
    /*************************************
    * Constructor sets all the state fields
    * and binds the functions necessary
    * for this file.
    **************************************/
    constructor(props) {
        super(props)

        this.state = {
            option_is: '0', // 0 - option 0th from drop_down chosen, 1 - option 1st, 2 - option 2nd, etc.
            queryResults: [],
            N: 10, //default value for number of cities for air quality
        }

        // Bind all the functions
        this.dropOnChange = this.dropOnChange.bind(this)
        this.updateGetVeggieCities = this.updateGetVeggieCities.bind(this)
        this.updateGetMichCities = this.updateGetMichCities.bind(this)
        this.updateGetAqiCities = this.updateGetAqiCities.bind(this)
        this.updateGetTop50Polluted = this.updateGetTop50Polluted.bind(this)
        this.updateGetYouthRatio = this.updateGetYouthRatio.bind(this)

    }

    dropOnChange(value) {
        this.setState({ option_is: value });
    }

    /*************************************
    * Function: Calls getVeggieCities
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateGetVeggieCities() {
        getVeggieCities().then(res => {
            this.setState({ queryResults: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }
    /*************************************
    * Function: Calls getMichCities
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateGetMichCities() {
        getMichCities().then(res => {
            this.setState({ queryResults: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getAqiCities
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateGetAqiCities() {
        getAqiCities().then(res => {
            this.setState({ queryResults: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getTop50Polluted
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateGetTop50Polluted() {
        getTop50Polluted().then(res => {
            this.setState({ queryResults: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
    }

    /*************************************
    * Function: Calls getYouthRatio
    * query from the backend to receieve 
    * results. If the query returns an 
    * empty array, throws an alert.
    * params: none
    * return: none
    **************************************/
    updateGetYouthRatio() {
        getYouthRatio().then(res => {
            this.setState({ queryResults: res.results })
            if (res.results.length == 0) {
                alert("Unfortunately we did not find any results that match this query.")
            }
        })
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
            getVeggieCities().then(res => {
                this.setState({ queryResults: res.results })
            })
        } else if (this.state.option_is == '1') {
            getMichCities().then(res => {
                this.setState({ queryResults: res.results })
            })
        } else if (this.state.option_is == '2') {
            getAqiCities().then(res => {
                this.setState({ queryResults: res.results })
            })
        } else if (this.state.option_is == '3') {
            getTop50Polluted().then(res => {
                this.setState({ queryResults: res.results })
            })
        }
        else { //get youth ratio - option 4
            getYouthRatio().then(res => {
                this.setState({ queryResults: res.results })
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
                <div style={{ backgroundImage: `url("https://www.hksinc.com/wp-content/uploads/2018/09/SanFrancisco_01-1024x555.jpg")` }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '0vh' }}></div>
                    <div class='filter-white2' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                        <p> Choose your criteria for city ranking in the dropdown menu </p>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                        <Select defaultValue="Most vegan/vegetarian restaurants" style={{ width: 600 }} onChange={this.dropOnChange}>
                            <Option value='0'>Most vegan/vegetarian restaurants</Option>
                            <Option value='1'>Most Michelin Restaurants</Option>
                            <Option value='2'>Best Air Quality</Option>
                            <Option value='3'>Worst Polluted Cities</Option>
                            <Option value='4'>Number of Public and Private Schools Per City</Option>
                        </Select>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                        {option_is == '0'
                            ?
                            <div>
                                <Form style={{ width: '5vw', margin: '0 auto', marginTop: '1vh' }}>
                                    <Row>
                                        <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto' }}>                                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                                            <Button style={{ marginTop: '4vh' }} onClick={this.updateGetVeggieCities}>Search</Button>
                                        </FormGroup></Col>
                                        </FormGroup></Col>
                                    </Row>
                                    <br></br>
                                </Form>
                                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                                    <Table dataSource={this.state.queryResults} columns={cityStateColumns} />
                                </div>
                            </div>
                            : option_is == '1' ?
                                <div>
                                    <Form style={{ width: '5vw', margin: '0 auto', marginTop: '1vh' }}>
                                        <Row>
                                            <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto' }}>                                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                                                <Button style={{ marginTop: '4vh' }} onClick={this.updateGetMichCities}>Search</Button>
                                            </FormGroup></Col>
                                            </FormGroup></Col>
                                        </Row>
                                        <br></br>
                                    </Form>
                                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                        <Table dataSource={this.state.queryResults} columns={michColumns} />
                                    </div>
                                </div>
                                : option_is == '2' ?
                                    <div>
                                        <Form style={{ width: '5vw', margin: '0 auto', marginTop: '1vh' }}>
                                            <Row>
                                                <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto' }}>                                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                                                    <Button style={{ marginTop: '4vh' }} onClick={this.updateGetAqiCities}>Search</Button>
                                                </FormGroup></Col>
                                                </FormGroup></Col>
                                            </Row>
                                            <br></br>
                                        </Form>
                                        <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                            <Table dataSource={this.state.queryResults} columns={cityStateColumns} />
                                        </div>
                                    </div>
                                    : option_is == '3' ?
                                        <div>
                                            <Form style={{ width: '5vw', margin: '0 auto', marginTop: '1vh' }}>
                                                <Row>
                                                    <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto' }}>                                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                                                        <Button style={{ marginTop: '4vh' }} onClick={this.updateGetTop50Polluted}>Search</Button>
                                                    </FormGroup></Col>
                                                    </FormGroup></Col>
                                                </Row>
                                                <br></br>
                                            </Form>
                                            <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                                <Table dataSource={this.state.queryResults} columns={cityStateColumns} />
                                            </div>
                                        </div> :
                                        option_is == '4' ?
                                            <div>
                                                <Form style={{ width: '5vw', margin: '0 auto', marginTop: '1vh' }}>
                                                    <Row>
                                                        <Col flex={2}><FormGroup style={{ width: '50vw', margin: '0 auto' }}>                                        <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                                                            <Button style={{ marginTop: '4vh' }} onClick={this.updateGetYouthRatio}>Search</Button>
                                                        </FormGroup></Col>
                                                        </FormGroup></Col>
                                                    </Row>
                                                    <br></br>
                                                </Form>
                                                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                                                    <Table dataSource={this.state.queryResults} columns={schoolColumns} />
                                                </div>
                                            </div> : <p>nun</p>
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default CityRankingsPage
