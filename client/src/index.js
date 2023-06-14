// All the imports
import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';

import HomePage from './pages/HomePage';
import 'antd/dist/antd.css';

import "bootstrap/dist/css/bootstrap.min.css";
import "shards-ui/dist/css/shards.min.css"
import FilterPage from './pages/FilterPage';
import CityRankingsPage from './pages/CityRankingsPage';
import NewsPage from './pages/NewsPage';
import MapPage from './pages/MapPage';

// Routing for paths and respective files
ReactDOM.render(
	<div>
		<Router>
			<Switch>
				<Route exact
					path="/"
					render={() => (
						<HomePage />
					)} />
				<Route exact
					path="/filter"
					render={() => (
						<FilterPage />
					)} />
				<Route exact
					path="/cityrankings"
					render={() => (
						<CityRankingsPage />
					)} />
				<Route exact
					path="/news"
					render={() => (
						<NewsPage />
					)} />
				<Route exact
					path="/map"
					render={() => (
						<MapPage />
					)} />
			</Switch>
		</Router>
	</div>,
	document.getElementById('root')
);


