import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Grow,
  Paper,
  Typography,
} from "@mui/material";
import { toPng } from "html-to-image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import certificate from "../../images/certificate.png";
import Image from "./HealthCourseImage";
import { useSelector } from "react-redux";

const CourseEnd = ({ courseState }) => {
  const { user } = useSelector((state) => state.auth);
  const [viewCertificate, setViewCertificate] = useState(false);
  const ref = useRef(null);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  useEffect(() => {
    setHours(Math.floor(courseState.course?.time / 3600));
    setMinutes(Math.floor((courseState.course?.time % 3600) / 60));
  }, [courseState.course?.time, user.id]);
  const handleDownloadCertificate = useCallback(() => {
    if (ref.current === null) {
      return;
    }

    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = `wellawareAI-${courseState.course.subject}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        // console.log(err);
      });
  }, [ref, courseState.course.subject]);

  return (
    <Box sx={{ display: "flex" }}>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          p: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            flexDirection: "column",
          }}
        >
          {!viewCertificate ? (
            <>
              <Grow in>
                <Box
                  sx={{
                    p: 5,
                    display: "flex",
                    position: "relative",
                    flexDirection: "row",
                    height: "30vh",
                    textAlign: "left",
                    color: "white",
                    alignItems: "center",
                    backgroundColor: "rgba(0, 0, 0, 0)",
                    backgroundImage:
                      "linear-gradient(to right, rgba(20, 26, 33, 0.88) 0%, rgb(20, 26, 33) 75%), url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/background/background-5.webp)",
                    backgroundRepeat: "no-repeat, no-repeat",
                    backgroundSize: "cover",
                    border: "1px solid #1C252E",
                    borderRadius: "16px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      flex: "1 1 auto",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        lineHeight: 1.5,
                        whiteSpace: "pre-line",
                      }}
                    >
                      Congratulations 🎉
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        mb: 1,
                        fontWeight: 700,
                        fontSize: "1.5rem",
                        lineHeight: 1.5,
                        whiteSpace: "pre-line",
                      }}
                    >
                      You finished the course for {courseState.course.subject}!
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: "260px" }}>
                    <Image />
                  </Box>
                </Box>
              </Grow>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    py: 3,
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    textAlign: "center",
                    display: "flex",
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={4}>
                      <Grow in>
                        <Paper
                          sx={{
                            backgroundImage: "none",
                            boxShadow:
                              "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            padding: "24px 20px 24px 24px",
                            zIndex: 0,
                          }}
                        >
                          <Box
                            sx={{
                              flexGrow: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "2rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {courseState.course.chapters.length}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Chapter
                              {courseState.course.chapters.length !== 1
                                ? "s"
                                : ""}
                              &nbsp;mastered
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "40px",
                              height: "40px",
                              display: "inline-flex",
                              top: "24px",
                              right: "17px",
                              position: "absolute",
                            }}
                          />
                          <Box
                            sx={{
                              top: "-44px",
                              width: "160px",
                              zIndex: -1,
                              height: "160px",
                              right: "-104px",
                              opacity: 0.12,
                              borderRadius: "24px",
                              position: "absolute",
                              transform: "rotate(40deg)",
                            }}
                          />
                        </Paper>
                      </Grow>
                    </Grid>

                    <Grid item xs={4}>
                      <Grow in>
                        <Paper
                          sx={{
                            backgroundImage: "none",
                            boxShadow:
                              "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            padding: "24px 20px 24px 24px",
                            zIndex: 0,
                          }}
                        >
                          <Box
                            sx={{
                              flexGrow: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "2rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {courseState.course.chapters.length * 3}
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Topics completed
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "40px",
                              height: "40px",
                              display: "inline-flex",

                              top: "24px",
                              right: "17px",
                              position: "absolute",
                            }}
                          />
                          <Box
                            sx={{
                              top: "-44px",
                              width: "160px",
                              zIndex: -1,
                              height: "160px",
                              right: "-104px",
                              opacity: 0.12,
                              borderRadius: "24px",
                              position: "absolute",
                              transform: "rotate(40deg)",
                            }}
                          />
                        </Paper>
                      </Grow>
                    </Grid>
                    <Grid item xs={4}>
                      <Grow in>
                        <Paper
                          sx={{
                            backgroundImage: "none",
                            boxShadow:
                              "rgba(0, 0, 0, 0.2) 0px 0px 2px 0px, rgba(0, 0, 0, 0.12) 0px 12px 24px -4px",
                            borderRadius: 4,
                            overflow: "hidden",
                            position: "relative",
                            padding: "24px 20px 24px 24px",
                            zIndex: 0,
                          }}
                        >
                          <Box
                            sx={{
                              flexGrow: 1,
                            }}
                          >
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: "2rem",
                                lineHeight: 1.5,
                              }}
                            >
                              {hours}h {minutes}m
                            </Typography>
                            <Typography
                              variant="subtitle2"
                              color="text.secondary"
                            >
                              Time Taken
                            </Typography>
                          </Box>
                          <Box
                            sx={{
                              width: "40px",
                              height: "40px",
                              display: "inline-flex",

                              top: "24px",
                              right: "17px",
                              position: "absolute",
                            }}
                          />
                          <Box
                            sx={{
                              top: "-44px",
                              width: "160px",
                              zIndex: -1,
                              height: "160px",
                              right: "-104px",
                              opacity: 0.12,
                              borderRadius: "24px",
                              position: "absolute",
                              transform: "rotate(40deg)",
                            }}
                          />
                        </Paper>
                      </Grow>
                    </Grid>
                  </Grid>
                </Box>
                <Button
                  sx={{ mt: 2, width: "30%" }}
                  variant="contained"
                  onClick={() => setViewCertificate(true)}
                >
                  Get Certificate
                </Button>
              </Box>
            </>
          ) : (
            <Grow in>
              <Card
                sx={{
                  p: 3,
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" sx={{ mb: 2 }}>
                  Congratulations, here's your certificate
                </Typography>
                <Divider sx={{ borderStyle: "dashed", my: 3, mx: -2 }} />
                <Box
                  sx={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  ref={ref}
                >
                  <img src={certificate} alt="certificate" height={400} />
                  <Typography
                    sx={{
                      position: "absolute",
                      color: "black",
                      textAlign: "center",
                      mt: -3,
                    }}
                    variant="h4"
                  >
                    {user.fName} {user.lName}
                  </Typography>

                  <Typography
                    sx={{
                      position: "absolute",
                      textAlign: "center",
                      mb: -5.5,
                      // ml: 2,
                      color: "success.dark",
                      mt: 1.5,
                    }}
                    fontWeight={600}
                  >
                    For mastery of&nbsp;
                    <span
                      style={{
                        textTransform: "capitalize",
                        fontWeight: 800,
                      }}
                    >
                      {courseState.course.subject.substring(0, 30)}{" "}
                      {courseState.course.subject < 30 && "..."}
                    </span>
                    &nbsp;
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    width: "100%",
                    justifyContent: "center",
                    mt: 2,
                  }}
                >
                  <Button
                    onClick={() => setViewCertificate(false)}
                    sx={{
                      backgroundColor: "rgb(58,67,79)",
                      color: "white",
                      mr: 0.5,
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    sx={{ ml: 0.5 }}
                    onClick={() => handleDownloadCertificate()}
                    variant="contained"
                  >
                    Download Certificate
                  </Button>
                </Box>
              </Card>
            </Grow>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseEnd;
