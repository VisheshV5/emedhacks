import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Calendar from "../components/Calendar";
import { findUserById } from "../services/user.service";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InsightsIcon from "@mui/icons-material/Insights";
import AssistantIcon from "@mui/icons-material/Assistant";
import TipsAndUpdatesIcon from "@mui/icons-material/TipsAndUpdates";

import { useDispatch, useSelector } from "react-redux";
import { MoreVert } from "@mui/icons-material";
import moment from "moment";

function Dashboard() {
  const [userData, setUserData] = useState({});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const userDataTemp = await findUserById(user.id);
      setUserData(userDataTemp);
      console.log(userDataTemp);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Grid container spacing={4} style={{ padding: "24px" }}>
      {console.log(userData)}
      {userData != {} && (
        <>
          <Grid container item xs={12} sm={6} direction="column" spacing={4}>
            <Grid item>
              <Card
                style={{
                  height: "25.3vh",
                  display: "flex",
                }}
              >
                <Box
                  sx={{
                    p: 3,
                    height: "100%",
                    display: "flex",
                    width: "30%",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 85,
                      height: 85,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                      mb: 2,
                      backgroundColor: "#00A76F",
                      color: "white",
                      fontWeight: 800,
                      textTransform: "uppercase",
                      fontSize: 30,
                    }}
                  >
                    {user?.fName[0] + user?.lName[0]}
                  </Avatar>
                </Box>
                <Box
                  sx={{
                    p: 3,
                    width: "70%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="h6" fontWeight={700}>
                    {userData?.fName} {userData?.lName}
                  </Typography>
                  <Typography
                    sx={{ mt: 1 }}
                    color="text.secondary"
                    fontWeight={500}
                  >
                    {userData?.email}
                  </Typography>
                  <Typography
                    sx={{ mt: 1, mb: 0.5 }}
                    variant="body2"
                    fontWeight={700}
                  >
                    Joined {moment(userData?.createdAt).format("MMMM Do, YYYY")}
                  </Typography>

                </Box>
              </Card>
            </Grid>
            <Grid item>
              <Card
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      p: 1,
                    }}
                  >
                    <AssistantIcon
                      sx={{ color: "#00a76f", fontSize: "30px", mx: 1 }}
                    />
                    <Typography
                      variant="h5"
                      component="div"
                      gutterBottom
                      sx={{ mt: 1 }}
                      fontWeight={600}
                    >
                      Suggested Resources
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 800 }}>Name</TableCell>
                          <TableCell sx={{ fontWeight: 800 }}>Link</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {userData?.preferences?.resources?.map((row, index) => (
                          <TableRow key={index} sx={{}}>
                            <TableCell
                              sx={{
                                fontWeight: 700,
                                color: "rgb(0, 167, 111)",
                              }}
                            >
                              {row.name}
                            </TableCell>
                            <TableCell sx={{}}>
                              <Link
                                href={row.link}
                                target="_blank"
                                rel="noopener"
                              >
                                <img
                                  src="https://img.icons8.com/fluent-systems-regular/200/FFFFFF/external-link.png"
                                  style={{ width: "30px", cursor: "pointer" }}
                                />
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 3,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <AutoAwesomeIcon
                  sx={{ mx: 1, color: "#00a76f", fontSize: "30px" }}
                />
                <Typography variant="h5" fontWeight={600}>
                  Daily Calendar To Stay Healthy
                </Typography>
              </Box>
              {userData?.preferences?.dailySchedule.length != 0 && (
                <Calendar
                  dailyCalendar={userData?.preferences?.dailySchedule}
                />
              )}
            </Card>
          </Grid>{" "}
        </>
      )}
    </Grid>
  );
}

export default Dashboard;
