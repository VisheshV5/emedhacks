import { combineReducers } from "redux";
import message from "./message";
import course from "./course";
import auth from "./auth";
import quiz from "./quiz";
import user from "./user";

export default combineReducers({
  auth,
  user,
  message,
  quiz,
  course,
});
