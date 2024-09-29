import {
  Box,
  CircularProgress,
  Container,
  Drawer,
  Typography,
} from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  completeTopic,
  enrollUser,
  finishCourse,
  getCourseById,
  getUserProgress,
  updateVideoProgress,
} from "../../services/course.service";
import CourseContent from "./HealthCourseContent";
import CourseEnd from "./HealthCourseEnd";
import CourseSidebar from "./HealthCourseSidebar";

const TakeCourse = () => {
  const { courseId } = useParams();
  const { user } = useSelector(state => state.auth);
  const [courseState, setCourseState] = useState({
    course: null,
    selectedTopic: null,
    expandedChapters: { 0: true },
    expandedQuestions: { 0: true },
    conceptCheckAnswers: {},
    conceptCheckCorrect: {},
    firstCorrectAnswers: {},
    currentStep: 0,
    currentChapterIndex: 0,
    currentTopicIndex: 0,
    progress: {},
    enrolled: false,
    videoProgress: {},
    loading: true,
    isLastStep: false,
    courseCompleted: false,
  });

  const sidebarScrollRef = useRef(null);
  const questionRefs = useRef([]);
  const playerRef = useRef(null);

  const fetchCourseAndProgress = useCallback(async () => {
    try {
      const response = await getCourseById(courseId);
      const isEnrolled = response.enrolledUsers.includes(user.id);

      setCourseState(prevState => ({
        ...prevState,
        course: response,
        enrolled: isEnrolled,
        loading: false,
      }));

      if (isEnrolled) {
        const progressResponse = await getUserProgress(courseId, user.id);
        if (progressResponse.userProgress) {
          const videoProgressMap = {};
          progressResponse.userProgress.chapters.forEach(
            (chapter, chapterIndex) => {
              chapter.topics.forEach((topic, topicIndex) => {
                videoProgressMap[`${chapterIndex}-${topicIndex}`] =
                  topic.videoProgress || 0;
              });
            }
          );
          setCourseState(prevState => ({
            ...prevState,
            progress: progressResponse.userProgress,
            videoProgress: videoProgressMap,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching course:", error);
      toast.error("Failed to load course data");
    }
  }, [courseId, user.id]);

  useEffect(() => {
    fetchCourseAndProgress();
  }, [fetchCourseAndProgress]);

  useEffect(() => {
    if (courseState.course) {
      const totalTopics = courseState.course.chapters.reduce(
        (sum, chapter) => sum + chapter.topics.length,
        0
      );
      setCourseState(prevState => ({
        ...prevState,
        isLastStep: prevState.currentStep === totalTopics - 1,
      }));
    }
  }, [courseState.currentStep, courseState.course]);

  useEffect(() => {
    const data = JSON.parse(
      localStorage.getItem(
        `course-progress-${user.id}-${courseState.course?._id}`
      )
    );
    if (data && courseState.course) {
      setCourseState(prevState => ({
        ...prevState,
        currentStep: data.currentStep,
        currentChapterIndex: data.currentChapterIndex,
        currentTopicIndex: data.currentTopicIndex,
        courseCompleted: data.courseCompleted,
        expandedChapters: data.expandedChapters,
        expandedQuestions: data.expandedQuestions,
        videoProgress: data.videoProgress || {},
      }));

      const flatTopics = courseState.course.chapters.flatMap(
        chapter => chapter.topics
      );
      const savedTopic = flatTopics[data.currentStep];
      if (savedTopic) {
        setCourseState(prevState => ({
          ...prevState,
          selectedTopic: savedTopic,
        }));
      }

      const scrollPosition = data.scrollPosition;
      if (scrollPosition) {
        setTimeout(() => {
          window.scrollTo({
            top: parseInt(scrollPosition),
            behavior: "smooth",
          });
        }, 50);
      }

      const sidebarScrollPosition = data.sidebarScrollPosition;
      if (sidebarScrollPosition && sidebarScrollRef.current) {
        setTimeout(() => {
          sidebarScrollRef.current.scrollTop(sidebarScrollPosition);
        }, 50);
      }
    }
  }, [user.id, courseState.course]);

  useEffect(() => {
    if (courseState.course && sidebarScrollRef.current) {
      localStorage.setItem(
        `course-progress-${user.id}-${courseState.course?._id}`,
        JSON.stringify({
          currentStep: courseState.currentStep,
          currentChapterIndex: courseState.currentChapterIndex,
          currentTopicIndex: courseState.currentTopicIndex,
          expandedChapters: courseState.expandedChapters,
          expandedQuestions: courseState.expandedQuestions,
          selectedTopic: courseState.selectedTopic
            ? courseState.selectedTopic.title
            : null,
          courseCompleted: courseState.courseCompleted,
          scrollPosition: window.scrollY,
          sidebarScrollPosition: sidebarScrollRef.current.getScrollTop(),
          videoProgress: courseState.videoProgress,
        })
      );
    }
  }, [
    courseState.currentStep,
    courseState.currentChapterIndex,
    courseState.currentTopicIndex,
    courseState.expandedChapters,
    courseState.expandedQuestions,
    courseState.selectedTopic,
    courseState.courseCompleted,
    user.id,
    courseState.course,
    courseState.videoProgress,
  ]);

  const handleStart = async () => {
    try {
      await enrollUser({ courseId: courseState.course._id, userId: user.id });
      setCourseState(prevState => ({ ...prevState, enrolled: true }));
      toast.success("Joined Course!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleVideoProgress = useCallback(
    progress => {
      const { currentChapterIndex, currentTopicIndex } = courseState;

      if (progress.playedSeconds > 0) {
        const key = `${currentChapterIndex}-${currentTopicIndex}`;
        setCourseState(prevState => ({
          ...prevState,
          videoProgress: {
            ...prevState.videoProgress,
            [key]: progress.playedSeconds.toFixed(1),
          },
        }));
        updateVideoProgress(
          courseId,
          currentChapterIndex,
          currentTopicIndex,
          user.id,
          progress.playedSeconds.toFixed(1)
        );
      }
    },
    [courseId, courseState, user.id]
  );

  const handleConceptCheckAnswer = (index, answer) => {
    const isCorrect =
      courseState.selectedTopic.conceptChecks[index].answer === answer;

    setCourseState(prevState => ({
      ...prevState,
      conceptCheckAnswers: {
        ...prevState.conceptCheckAnswers,
        [index]: answer,
      },
      conceptCheckCorrect: {
        ...prevState.conceptCheckCorrect,
        [index]: isCorrect,
      },
      firstCorrectAnswers: {
        ...prevState.firstCorrectAnswers,
        [index]: isCorrect && !prevState.firstCorrectAnswers[index],
      },
    }));

    if (
      isCorrect &&
      index < courseState.selectedTopic.conceptChecks.length - 1
    ) {
      questionRefs.current[index + 1].scrollIntoView({ behavior: "smooth" });
      toggleQuestion(index + 1);
    }
  };

  const toggleChapter = chapterIndex => {
    setCourseState(prevState => ({
      ...prevState,
      expandedChapters: {
        ...prevState.expandedChapters,
        [chapterIndex]: !prevState.expandedChapters[chapterIndex],
      },
    }));
  };

  const toggleQuestion = questionIndex => {
    setCourseState(prevState => ({
      ...prevState,
      expandedQuestions: {
        ...prevState.expandedQuestions,
        [questionIndex]: !prevState.expandedQuestions[questionIndex],
      },
    }));
  };

  const goToNextStep = useCallback(() => {
    const flatTopics = courseState.course.chapters.flatMap(
      (chapter, chapterIndex) =>
        chapter.topics.map((topic, topicIndex) => ({
          ...topic,
          chapterIndex,
          topicIndex,
        }))
    );
    if (courseState.currentStep < flatTopics.length - 1) {
      const nextStep = courseState.currentStep + 1;
      const nextTopic = flatTopics[nextStep];
      setCourseState(prevState => ({
        ...prevState,
        currentStep: nextStep,
        selectedTopic: nextTopic,
        currentChapterIndex: nextTopic.chapterIndex,
        currentTopicIndex: nextTopic.topicIndex,
        conceptCheckAnswers: {},
        conceptCheckCorrect: {},
      }));
    }
  }, [courseState.course, courseState.currentStep]);

  const goToPreviousStep = useCallback(() => {
    if (courseState.currentStep > 0) {
      const flatTopics = courseState.course.chapters.flatMap(
        (chapter, chapterIndex) =>
          chapter.topics.map((topic, topicIndex) => ({
            ...topic,
            chapterIndex,
            topicIndex,
          }))
      );
      const previousStep = courseState.currentStep - 1;
      const previousTopic = flatTopics[previousStep];
      setCourseState(prevState => ({
        ...prevState,
        currentStep: previousStep,
        selectedTopic: previousTopic,
        currentChapterIndex: previousTopic.chapterIndex,
        currentTopicIndex: previousTopic.topicIndex,
        conceptCheckAnswers: {},
        conceptCheckCorrect: {},
      }));
    }
  }, [courseState.course, courseState.currentStep]);

  const completeTopicHandler = useCallback(
    async (chapterIndex, topicIndex) => {
      try {
        const totalQuestions = Object.keys(
          courseState.conceptCheckCorrect
        ).length;
        const correctAnswers = Object.values(
          courseState.conceptCheckCorrect
        ).filter(Boolean).length;
        const score =
          totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

        const result = await completeTopic(
          courseId,
          chapterIndex,
          topicIndex,
          user.id,
          score
        );
        setCourseState(prevState => ({
          ...prevState,
          progress: result.userProgress,
          conceptCheckAnswers: {},
          conceptCheckCorrect: {},
        }));
        goToNextStep();
      } catch (error) {
        console.error("Error completing topic:", error);
        toast.error("Failed to complete topic");
      }
    },
    [courseId, user.id, courseState.conceptCheckCorrect, goToNextStep]
  );

  const finishCourseHandler = useCallback(async () => {
    try {
      await finishCourse(courseId, user.id);

      setCourseState(prevState => ({
        ...prevState,
        courseCompleted: true,
      }));
    } catch (error) {
      console.error("Error finishing course:", error);
      toast.error("Failed to finish course");
    }
  }, [courseId, user.id]);

  if (courseState.loading) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Container component="main" sx={{ flexGrow: 1, px: 3 }}>
        {courseState.courseCompleted ? (
          <CourseEnd courseState={courseState} />
        ) : (
          <CourseContent
            courseState={courseState}
            setCourseState={setCourseState}
            handleStart={handleStart}
            completeTopicHandler={completeTopicHandler}
            handleVideoProgress={handleVideoProgress}
            handleConceptCheckAnswer={handleConceptCheckAnswer}
            goToNextStep={goToNextStep}
            goToPreviousStep={goToPreviousStep}
            toggleQuestion={toggleQuestion}
            questionRefs={questionRefs}
            playerRef={playerRef}
            finishCourseHandler={finishCourseHandler}
          />
        )}
      </Container>
      <Drawer
        variant="permanent"
        anchor="right"
        sx={{
          width: 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
            bgcolor: "#28323D",
            backgroundImage: "none",
            border: "none",
          },
        }}
      >
        <CourseSidebar
          courseState={courseState}
          setCourseState={setCourseState}
          sidebarScrollRef={sidebarScrollRef}
          toggleChapter={toggleChapter}
          finishCourseHandler={finishCourseHandler}
        />
      </Drawer>
    </Box>
  );
};

export default TakeCourse;
