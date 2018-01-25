import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  Switch
} from 'react-router-dom';

import store from './config/store';
import Board from './components/Board';

const path = "/:levels/:views/:parents/:modes/:years/:sorts/:dims";
const provider = (
	<Provider store = {store}>
		<Router>
			<Switch>
				<Route component = {Board} path = {path} />
				<Route component = {Board} path = '/' />
			</Switch>
		</Router>
	</Provider>
);

const root = document.getElementById('root');

ReactDom.render(provider, root);
