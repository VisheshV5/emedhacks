import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_BASE_URL + "/courses");
    return response.data;
  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const response = await axios.get(API_BASE_URL + `/course/${courseId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting course by ID:", error);
    throw error;
  }
};

export const completeTopic = async (
  courseId,
  chapterIndex,
  topicIndex,
  userId,
  score
) => {
  try {
    const response = await axios.post(
      API_BASE_URL +
        `/course/${courseId}/complete/${chapterIndex}/${topicIndex}`,
      { userId, completed: true, score }
    );
    return response.data;
  } catch (error) {
    console.error("Error completing topic:", error);
    throw error;
  }
};

export const createCourse = async (userId, courseData) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `/course/create/${userId}`,
      courseData
    );

    return response.data;
  } catch (error) {
    console.error("Error creating course:", error);
    throw error;
  }
};

export const generateTopics = async (courseId) => {
  try {
    const response = await axios.get(
      API_BASE_URL + `/course/generateTopics/${courseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error generating topics:", error);
    throw error;
  }
};

export const enrollUser = async ({ courseId, userId }) => {
  try {
    const response = await axios.post(
      API_BASE_URL + `/course/${courseId}/enroll`,
      { userId }
    );
    return response.data;
  } catch (error) {
    console.error("Error enrolling user:", error);
    throw error;
  }
};

export const getUserProgress = async (courseId, userId) => {
  try {
    const response = await axios.get(
      API_BASE_URL + `/course/${courseId}/progress/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

export const updateVideoProgress = async (
  courseId,
  chapterIndex,
  topicIndex,
  userId,
  progress
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/course/${courseId}/progress/${chapterIndex}/${topicIndex}`,
      { userId, progress }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating video progress:", error);
    throw error;
  }
};

export const finishCourse = async (courseId, userId) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/course/${courseId}/finish/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error finishing course:", error);
    throw error;
  }
};
