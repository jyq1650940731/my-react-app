import { createStore, applyMiddleware } from 'redux';
import reduxLogger from 'redux-logger';
import reduxPromise from 'redux-promise';
import reduxThunk from 'redux-thunk';
import reducer from './reducer';

let middleware = [reduxThunk, reduxPromise],
    env = process.env.NODE_ENV
if (env === "development") {
    middleware.push(reduxLogger)
}
const store = createStore(
    reducer,
    applyMiddleware(...middleware)
)

export default store