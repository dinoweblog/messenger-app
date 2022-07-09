import { createStore, combineReducers, applyMiddleware } from "redux";

import thunk from "redux-thunk";
import { loginReducer } from "./Login/reducer";

export const rootReducer = combineReducers({
  login: loginReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
