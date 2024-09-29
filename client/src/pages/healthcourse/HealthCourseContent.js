import { Icon } from "@iconify/react/dist/iconify.js";
import {
  CheckCircleOutlineRounded,
  ExpandMoreOutlined,
  HighlightOffOutlined,
  RadioButtonUnchecked,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Collapse,
  Divider,
  Grid,
  Skeleton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import React, { Suspense, lazy, useEffect, useState } from "react";
import ConfettiExplosion from "react-confetti-explosion";
import { ExpandMore } from "../../common/components/ExpandMore";
import { useSelector } from "react-redux";

const LazyReactPlayer = lazy(() => import("react-player/youtube"));

const CourseContent = ({
  courseState,
  setCourseState,
  handleStart,
  completeTopicHandler,
  handleVideoProgress,
  handleConceptCheckAnswer,
  goToNextStep,
  goToPreviousStep,
  toggleQuestion,
  questionRefs,
  playerRef,
  progress,
  finishCourseHandler,
}) => {
  const {
    course,
    selectedTopic,
    enrolled,
    videoProgress,
    currentStep,
    expandedQuestions,
    conceptCheckAnswers,
    conceptCheckCorrect,
  } = courseState;
  const { currentChapterIndex, currentTopicIndex } = courseState;

  if (!selectedTopic) {
    setCourseState((prevState) => ({
      ...prevState,
      selectedTopic: course.chapters[0].topics[0],
    }));
  }

  return (
    <>
      <Typography
        variant="subtitle2"
        color="text.secondary"
        sx={{ fontWeight: 700 }}
      >
        Chapter {currentChapterIndex + 1} • Topic {currentTopicIndex + 1}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700 }}>
        {selectedTopic?.title}
      </Typography>
      <Box
        sx={{
          mt: 2,
          height: "55vh",
          position: "relative",
        }}
      >
        <Suspense
          fallback={
            <Skeleton
              variant="rounded"
              width="100%"
              height="55vh"
              animation="wave"
              sx={{ borderRadius: 2 }}
            />
          }
        >
          {enrolled ? (
            <LazyReactPlayer
              width="100%"
              height="100%"
              ref={playerRef}
              url={selectedTopic?.videoUrl}
              controls={true}
              playing={true}
              onReady={() => {
                playerRef.current.seekTo(
                  videoProgress[
                    `${currentChapterIndex}-${currentTopicIndex}`
                  ] || 0
                );
              }}
              onProgress={handleVideoProgress}
            />
          ) : (
            <>
              <LazyReactPlayer
                width="100%"
                height="100%"
                style={{
                  zIndex: -2,
                  opacity: 0.1,
                  pointerEvents: "none",
                  position: "absolute",
                }}
                url={selectedTopic?.videoUrl}
              />
              <Box
                sx={{
                  p: 4,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  position: "absolute",
                  flexDirection: "column",
                }}
              >
                <Icon
                  icon="solar:lock-keyhole-minimalistic-bold"
                  width="80"
                  height="80"
                />
                <Typography variant="h4" sx={{ mt: 2 }}>
                  Item Locked
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  Join the course to view
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleStart}
                >
                  Join Course
                </Button>
              </Box>
            </>
          )}
        </Suspense>
      </Box>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6">Concept Check</Typography>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 4 }}>
        Let's quickly check your understanding of this topic.
      </Typography>
      {enrolled ? (
        selectedTopic?.conceptChecks &&
        selectedTopic?.conceptChecks.map((check, index) => (
          <Box
            key={index}
            ref={(el) => (questionRefs.current[index] = el)}
            sx={{
              bgcolor: "#28323D",
              borderRadius: 2,
              p: 2,
              mb: 3,
            }}
          >
            <Box
              onClick={() => toggleQuestion(index)}
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                gap: 1,
              }}
            >
              <ExpandMore
                disabled={index > 0 && !conceptCheckAnswers[index - 1]}
                expand={expandedQuestions?.[index]}
                size="small"
              >
                <ExpandMoreOutlined />
              </ExpandMore>
              <Typography
                variant="body1"
                color={
                  index > 0 && !conceptCheckAnswers[index - 1] && "#637381"
                }
                sx={{
                  fontWeight: "bold",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                {check.question}
              </Typography>
            </Box>
            <Collapse
              in={expandedQuestions[index]}
              timeout="auto"
              unmountOnExit
            >
              <Grid container spacing={2} sx={{ pt: 2 }}>
                {check.options.map((option, optionIndex) => (
                  <Grid item xs={6} key={optionIndex}>
                    <Button
                      variant="outlined"
                      startIcon={
                        conceptCheckAnswers[index] === option ? (
                          conceptCheckCorrect[index] ? (
                            <CheckCircleOutlineRounded fontSize="small" />
                          ) : (
                            <HighlightOffOutlined fontSize="small" />
                          )
                        ) : (
                          <RadioButtonUnchecked fontSize="small" />
                        )
                      }
                      fullWidth
                      onClick={() => handleConceptCheckAnswer(index, option)}
                      disabled={index > 0 && !conceptCheckAnswers[index - 1]}
                      sx={{
                        minHeight: "100%",
                        justifyContent: "flex-start",
                        fontWeight: 600,
                        borderColor:
                          conceptCheckAnswers[index] === option
                            ? conceptCheckCorrect[index]
                              ? "success.main"
                              : "error.main"
                            : "none",
                        backgroundColor:
                          conceptCheckAnswers[index] === option
                            ? conceptCheckCorrect[index]
                              ? "rgba(80, 193, 60, 0.08)"
                              : "rgba(255, 86, 48, 0.08)"
                            : "inherit",
                        color:
                          conceptCheckAnswers[index] === option
                            ? conceptCheckCorrect[index]
                              ? "success.main"
                              : "error.main"
                            : "inherit",
                        "&:hover": {
                          backgroundColor:
                            conceptCheckAnswers[index] === option
                              ? conceptCheckCorrect[index]
                                ? "rgba(80, 193, 60, 0.16)"
                                : "rgba(255, 72, 66, 0.16)"
                              : "none",
                          borderColor:
                            conceptCheckAnswers[index] === option
                              ? conceptCheckCorrect[index]
                                ? "success.main"
                                : "error.main"
                              : "none",
                        },
                      }}
                    >
                      {conceptCheckAnswers[index] === option &&
                        conceptCheckCorrect[index] &&
                        courseState.firstCorrectAnswers[index] && (
                          <ConfettiExplosion
                            force={0.4}
                            duration={2200}
                            particleCount={30}
                            width={400}
                            onComplete={() => {
                              setCourseState((prevState) => ({
                                ...prevState,
                                firstCorrectAnswers: {
                                  ...prevState.firstCorrectAnswers,
                                  [index]: false,
                                },
                              }));
                            }}
                          />
                        )}
                      {option}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Box>
        ))
      ) : (
        <Box sx={{ position: "relative", width: "100%", height: "40%", mb: 5 }}>
          <Box
            sx={{
              bgcolor: "#28323D",
              borderRadius: 2,
              p: 2,
              mb: 3,
              opacity: 0.15,
              width: "100%",
              zIndex: -2,
              position: "absolute",
            }}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            >
              <ExpandMore>
                <ExpandMoreOutlined />
              </ExpandMore>
              <Typography
                variant="body1"
                sx={{
                  fontWeight: "bold",
                  pointerEvents: "none",
                  userSelect: "none",
                }}
              >
                Question
              </Typography>
            </Box>
            <Collapse timeout="auto" unmountOnExit in={true}>
              <Grid container spacing={2} sx={{ mt: 1 }}>
                {[0, 1, 2, 3].map((_, index) => (
                  <Grid item xs={6} key={index}>
                    <Button
                      variant="outlined"
                      startIcon={<RadioButtonUnchecked fontSize="small" />}
                      fullWidth
                      sx={{
                        justifyContent: "flex-start",
                        fontWeight: 600,
                      }}
                    >
                      Option
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </Collapse>
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              zIndex: 10,
              position: "absolute",
              flexDirection: "column",
            }}
          >
            <Icon
              icon="solar:lock-keyhole-minimalistic-bold"
              width="50"
              height="50"
            />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Item Locked
            </Typography>
            <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
              Join the course to view
            </Typography>
          </Box>
        </Box>
      )}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <div>
          <Button
            variant="outlined"
            onClick={goToPreviousStep}
            disabled={currentStep === 0}
            startIcon={<ChevronLeft />}
            sx={{ mr: 2 }}
          >
            Previous
          </Button>
          <Button
            variant="contained"
            onClick={goToNextStep}
            endIcon={<ChevronRight />}
            disabled={
              currentStep ===
              course.chapters.flatMap((c) => c.topics).length - 1
            }
          >
            Next
          </Button>
        </div>
        <Tooltip
          title={
            !enrolled
              ? "Please enroll in course to complete"
              : !selectedTopic?.conceptChecks.every(
                  (_, index) => conceptCheckCorrect[index]
                )
              ? "Make sure all questions are answered correctly"
                ? progress?.chapters?.[currentChapterIndex]?.topics?.[
                    currentTopicIndex
                  ]?.completed
                : "Topic already completed"
              : ""
          }
        >
          <span>
            <LoadingButton
              loading={false}
              loadingPosition="start"
              variant="contained"
              color="primary"
              startIcon={<Check />}
              disabled={
                !courseState.enrolled ||
                !selectedTopic?.conceptChecks.every(
                  (_, index) => courseState.conceptCheckCorrect[index]
                ) ||
                courseState.progress?.chapters?.[
                  courseState.currentChapterIndex
                ]?.topics?.[courseState.currentTopicIndex]?.completed
              }
              onClick={() =>
                courseState.isLastStep &&
                courseState.progress?.chapters?.every((chapter) =>
                  chapter.topics.every((topic) => topic.completed)
                )
                  ? finishCourseHandler()
                  : completeTopicHandler(
                      courseState.currentChapterIndex,
                      courseState.currentTopicIndex
                    )
              }
            >
              {courseState.isLastStep &&
              courseState.progress?.chapters?.every((chapter) =>
                chapter.topics.every((topic) => topic.completed)
              )
                ? "Finish Course"
                : "Complete Topic"}
            </LoadingButton>
          </span>
        </Tooltip>
      </Box>
    </>
  );
};

export default CourseContent;
