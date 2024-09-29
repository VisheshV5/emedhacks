import * as courseService from "../services/course.service";
import {
  CREATE_COURSE_FAILURE,
  CREATE_COURSE_REQUEST,
  CREATE_COURSE_SUCCESS,
  DELETE_COURSE_FAILURE,
  DELETE_COURSE_REQUEST,
  DELETE_COURSE_SUCCESS,
  SET_CURRENT_COURSE,
  SET_CURRENT_COURSES,
  SET_MESSAGE,
  UPDATE_COURSE_FAILURE,
  UPDATE_COURSE_REQUEST,
  UPDATE_COURSE_SUCCESS,
} from "../types/types";

export const setCurrentCourses = courses => ({
  type: SET_CURRENT_COURSES,
  payload: courses,
});

export const setCurrentCourse = course => ({
  type: SET_CURRENT_COURSE,
  payload: course,
});

export const createCourseRequest = () => ({
  type: CREATE_COURSE_REQUEST,
});

export const createCourseSuccess = course => ({
  type: CREATE_COURSE_SUCCESS,
  payload: course,
});

export const createCourseFailure = error => ({
  type: CREATE_COURSE_FAILURE,
  payload: error,
});

export const setMessage = message => ({
  type: SET_MESSAGE,
  payload: message,
});

export const createCourse = (userId, courseData) => dispatch => {
  dispatch(createCourseRequest());

  return courseService.createCourse(userId, courseData).then(
    data => {
      dispatch(createCourseSuccess(data.message));
      dispatch(setMessage(data.message));
      return Promise.resolve(data.message);
    },
    error => {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      dispatch(createCourseFailure(message));
      dispatch(setMessage(message));
      return Promise.reject(message);
    }
  );
};

export const updateCourseRequest = () => ({ type: UPDATE_COURSE_REQUEST });
export const updateCourseSuccess = course => ({
  type: UPDATE_COURSE_SUCCESS,
  payload: course,
});
export const updateCourseFailure = error => ({
  type: UPDATE_COURSE_FAILURE,
  payload: error,
});

export const deleteCourseRequest = () => ({ type: DELETE_COURSE_REQUEST });
export const deleteCourseSuccess = courseId => ({
  type: DELETE_COURSE_SUCCESS,
  payload: courseId,
});
export const deleteCourseFailure = error => ({
  type: DELETE_COURSE_FAILURE,
  payload: error,
});
