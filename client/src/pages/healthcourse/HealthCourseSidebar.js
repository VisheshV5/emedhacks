import { Icon } from "@iconify/react/dist/iconify.js";
import { ExpandMoreOutlined, RadioButtonUnchecked } from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useSelector } from "react-redux";
import { ExpandMore } from "../../common/components/ExpandMore";

const CourseSidebar = ({
  courseState,
  setCourseState,
  sidebarScrollRef,
  finishCourseHandler,
}) => {
  const { user } = useSelector(state => state.auth);
  const { course, expandedChapters, selectedTopic, progress } = courseState;

  const toggleChapter = chapterIndex => {
    setCourseState(prevState => ({
      ...prevState,
      expandedChapters: {
        ...prevState.expandedChapters,
        [chapterIndex]: !prevState.expandedChapters[chapterIndex],
      },
    }));
  };

  const handleTopicClick = (topic, chapterIndex, topicIndex) => {
    const overallIndex = calculateOverallIndex(chapterIndex, topicIndex);

    setCourseState(prevState => ({
      ...prevState,
      selectedTopic: topic,
      currentStep: overallIndex,
      currentChapterIndex: chapterIndex,
      currentTopicIndex: topicIndex,
      courseCompleted: false,
    }));

    localStorage.setItem(
      `course-progress-${user.id}-${course?._id}`,
      JSON.stringify({
        currentStep: overallIndex,
        selectedTopicId: topic._id,
        currentChapterIndex: chapterIndex,
        currentTopicIndex: topicIndex,
      })
    );
  };

  const calculateOverallIndex = (chapterIndex, topicIndex) => {
    let overallIndex = 0;
    for (let i = 0; i < chapterIndex; i++) {
      overallIndex += course.chapters[i].topics.length;
    }
    return overallIndex + topicIndex;
  };

  const allTopicsCompleted = courseState.progress?.chapters?.every(chapter =>
    chapter.topics.every(topic => topic.completed)
  );

  return (
    <Scrollbars
      ref={sidebarScrollRef}
      autoHide
      style={{ border: 0, outline: 0 }}
      renderThumbVertical={({ style, ...props }) => (
        <div
          {...props}
          style={{
            ...style,
            backgroundColor: "#39454f",
            borderRadius: 3,
            height: "10%",
            outline: "none",
            border: "none",
          }}
        />
      )}
    >
      <Box sx={{ position: "sticky", top: 0, zIndex: 1, bgcolor: "#28323D" }}>
        <Typography variant="h6" sx={{ p: 2, textTransform: "capitalize" }}>
          {course.title}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ padding: 2 }}>
        {course.chapters.map((chapter, chapterIndex) => (
          <React.Fragment key={chapterIndex}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <div onClick={() => toggleChapter(chapterIndex)}>
                <ExpandMore expand={expandedChapters[chapterIndex]}>
                  <ExpandMoreOutlined />
                </ExpandMore>
              </div>
              <div>
                <Typography
                  variant="subtitle2"
                  color="text.secondary"
                  sx={{ fontWeight: 700 }}
                >
                  Chapter {chapterIndex + 1}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {chapter.title}
                </Typography>
              </div>
            </Box>
            <List component="div" disablePadding>
              <Collapse
                in={expandedChapters[chapterIndex]}
                timeout="auto"
                unmountOnExit
              >
                {chapter.topics.map((topic, topicIndex) => (
                  <ListItemButton
                    selected={
                      selectedTopic?._id === topic?._id &&
                      !courseState.courseCompleted
                    }
                    key={topicIndex}
                    onClick={() =>
                      handleTopicClick(topic, chapterIndex, topicIndex)
                    }
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&:hover": {
                        backgroundColor: "rgba(145 158 171 / 0.08)",
                      },
                      "&.Mui-selected": {
                        backgroundColor: "rgba(145 158 171 / 0.16)",
                        backgroundImage: "transparent",
                        "&:hover": {
                          backgroundColor: "rgba(145 158 171 / 0.16)",
                        },
                      },
                    }}
                  >
                    <ListItemIcon sx={{ mr: -2 }}>
                      {progress &&
                      progress.chapters &&
                      progress.chapters[chapterIndex] &&
                      progress.chapters[chapterIndex].topics[topicIndex]
                        .completed ? (
                        <Icon
                          icon="solar:check-circle-bold"
                          color="#22C55E"
                          width="26"
                          height="26"
                        />
                      ) : (
                        <RadioButtonUnchecked />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={topic.title} />
                  </ListItemButton>
                ))}
              </Collapse>
            </List>
            {chapterIndex < course.chapters.length - 1 && (
              <Divider sx={{ borderStyle: "dashed", ml: -3, mr: -4, my: 2 }} />
            )}
          </React.Fragment>
        ))}
        <ListItemButton
          selected={courseState.courseCompleted}
          disabled={!allTopicsCompleted}
          onClick={finishCourseHandler}
          sx={{
            borderRadius: 2,
            mb: 1,
            "&.Mui-selected": {
              backgroundColor: "rgba(145 158 171 / 0.16)",
              "&:hover": {
                backgroundColor: "rgba(145 158 171 / 0.16)",
              },
            },
          }}
        >
          <ListItemIcon sx={{ mr: -2 }}>
            <Icon
              icon={
                courseState.courseCompleted
                  ? "solar:check-circle-bold"
                  : allTopicsCompleted
                  ? "solar:medal-ribbons-star-bold"
                  : "solar:lock-keyhole-minimalistic-bold"
              }
              color={
                courseState.courseCompleted
                  ? "#22C55E"
                  : allTopicsCompleted
                  ? "#FFAB00"
                  : "#637381"
              }
              width={allTopicsCompleted ? "30" : "28"}
              height={allTopicsCompleted ? "30" : "28"}
            />
          </ListItemIcon>
          <ListItemText primary="Finish Course" />
        </ListItemButton>
      </List>
    </Scrollbars>
  );
};

export default CourseSidebar;
