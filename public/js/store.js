// client/store.js
import { createStore as reduxCreateStore, combineReducers } from "redux";

// 1) define your user reducer (and any others)
function userReducer(state = null, action) {
  switch (action.type) {
    case "SET_USER":
      return action.payload;
    default:
      return state;
  }
}

// 2) combine and export a factory
const rootReducer = combineReducers({
  user: userReducer,
  // …other slices
});

export function createStore({ preloadedState } = {}) {
  return reduxCreateStore(rootReducer, preloadedState);
}
