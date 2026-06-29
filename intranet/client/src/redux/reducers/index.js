import { combineReducers } from "redux";

import themeReducer from "./themeReducers";
import listReducer from "./listReducers";

export default combineReducers({
  themeReducer,
  listReducer,
});
