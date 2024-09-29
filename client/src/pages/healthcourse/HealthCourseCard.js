import { AccessTime, FormatListBulleted, People } from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import noImage from "../../images/noImage.png";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { enrollUser } from "../../services/course.service";

export default function CourseCard({ course }) {
  const { user } = useSelector(state => state.auth);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [enrolled, setEnrolled] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      await enrollUser({ courseId: course._id, userId: user.id });

      navigate(`/health-course/${course._id}`);
      toast.success("Joined Course!");
    } catch (err) {
      toast.error(err);
    }
  };

  useEffect(() => {
    setHours(Math.floor(course?.time / 3600));
    setMinutes(Math.floor((course?.time % 3600) / 60));

    if (course.enrolledUsers.includes(user.id)) {
      setEnrolled(true);
    }
  }, [course?.time, user.id, course.enrolledUsers]);

  return (
    <>
      <Grow in>
        {course && (
          <Card
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardMedia
              component="img"
              image={course.imageUrl || noImage}
              alt={course.description}
              sx={{
                width: "auto",
                margin: theme => theme.spacing(1, 1, 0, 1),
                borderRadius: 2,
                height: 151,
                filter: "brightness(60%)",
              }}
            />
            <CardContent
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                mb: -2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 1,
                  gap: "4px",
                }}
              >
                <Tooltip title="Course Duration">
                  <Chip
                    sx={{ "& .MuiChip-label": { fontWeight: 600 } }}
                    label={`${hours}h ${minutes}m`}
                    icon={<AccessTime />}
                  />
                </Tooltip>
                <Tooltip title="Enrolled Users">
                  <Chip
                    sx={{ "& .MuiChip-label": { fontWeight: 600 } }}
                    label={course.enrolledUsers.length}
                    icon={<People />}
                  />
                </Tooltip>
                <Tooltip title="Number of Chapters">
                  <Chip
                    sx={{ "& .MuiChip-label": { fontWeight: 600 } }}
                    label={course.chapters.length}
                    icon={<FormatListBulleted />}
                  />
                </Tooltip>
              </Box>

              <Box sx={{ px: 1 }}>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    cursor: "pointer",
                    textTransform: "capitalize",
                    textOverflow: "ellipsis",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                  onClick={() => {
                    navigate(`/health-course/${course._id}`);
                  }}
                >
                  {course.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  component="div"
                  sx={{
                    mt: 1,
                    wordBreak: "break-word",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {course?.description?.substring(0, 40)}
                  {course?.description?.length > 40 && "..."}
                </Typography>
              </Box>
            </CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                padding: theme => theme.spacing(0, 2, 3),
              }}
            >
              <Button
                variant="contained"
                sx={{ mt: 2, marginLeft: "auto" }}
                disabled={enrolled}
                onClick={() => handleStart()}
              >
                {enrolled ? "Joined" : "Start"}
              </Button>
            </Box>
          </Card>
        )}
      </Grow>
    </>
  );
}
