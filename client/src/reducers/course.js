import {
  CREATE_COURSE_REQUEST,
  CREATE_COURSE_SUCCESS,
  CREATE_COURSE_FAILURE,
  UPDATE_COURSE_REQUEST,
  UPDATE_COURSE_SUCCESS,
  UPDATE_COURSE_FAILURE,
  DELETE_COURSE_REQUEST,
  DELETE_COURSE_SUCCESS,
  DELETE_COURSE_FAILURE,
  SET_CURRENT_COURSE,
  SET_CURRENT_COURSES,
} from "../types/types";

const initialState = {
  courses: [],
  currentCourse: {},
  loading: false,
  finished: false,
  error: null,
};

const courseReducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_COURSE_REQUEST:
    case UPDATE_COURSE_REQUEST:
    case DELETE_COURSE_REQUEST:
      return { ...state, loading: true, finished: false, error: null };

    case CREATE_COURSE_SUCCESS:
      return {
        ...state,
        courses: [...state.courses, action.payload],
        currentCourse: action.payload,
        finished: true,
        loading: false,
        error: null,
      };

    case UPDATE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.map(course =>
          course._id === action.payload._id ? action.payload : course
        ),
        currentCourse: action.payload,
        loading: false,
        error: null,
      };

    case DELETE_COURSE_SUCCESS:
      return {
        ...state,
        courses: state.courses.filter(course => course._id !== action.payload),
        currentCourse: {},
        loading: false,
        error: null,
      };

    case CREATE_COURSE_FAILURE:
    case UPDATE_COURSE_FAILURE:
    case DELETE_COURSE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SET_CURRENT_COURSE:
      return {
        ...state,
        currentCourse: action.payload,
      };

    case SET_CURRENT_COURSES:
      return {
        ...state,
        courses: action.payload,
      };

    default:
      return state;
  }
};

export default courseReducer;