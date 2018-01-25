import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';

import { View, Mode, Sort } from './options';

import reducers from '../reducers';

const logger = (store) => (next) => (action) => {
	console.log("Action: ", action.type);
	console.log("Payload: ", action.payload);
	next(action);
};

const middleware = applyMiddleware(thunk, logger);
const store = createStore (reducers, middleware);

store.subscribe(() => {
	console.log("Store changed: ", store.getState());
});

export default store;
