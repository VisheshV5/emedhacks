import { Icon } from "@iconify/react/dist/iconify.js";
import { ChevronRightRounded, ExpandMoreRounded } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  DialogTitle,
  Divider,
  IconButton,
  ListSubheader,
  Drawer as MuiDrawer,
  Stack,
  styled,
  Typography,
  useTheme,
} from "@mui/material";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../actions/auth";
import UserService from "../services/user.service";
import MenuItem from "./MenuItem";

const drawerWidth = 300;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(10)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(11)} + 1px)`,
  },
});

const DrawerHeader = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: "20px 0 8px 28px",
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
  [theme.breakpoints.down("sm")]: {
    width: "100%",
  },
}));

export default function MiniDrawer({ open, setOpen, isTemporary }) {
  const { user } = useSelector((state) => state.auth);
  const { isLoggedIn } = useSelector((state) => state.auth);
  const [collapse, setCollapse] = useState(true);
  const [collapseGenerate, setCollapseGenerate] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();

  const menuItems = [
    {
      name: "Dashboard",
      linkName: "/dashboard",
      icon: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/navbar/ic-dashboard.svg) center center / contain no-repeat",
    },
    {
      name: "Health Courses",
      linkName: "/health-courses",
      icon: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/navbar/ic-course.svg) center center / contain no-repeat",
    },
    {
      name: "Symptom Checker",
      linkName: "/symptom-checker",
      icon: "url(https://assets.minimals.cc/public/assets/icons/navbar/ic-chat.svg) center center / contain no-repeat",
    },
  ];

  const generateItems = [
    {
      name: "Create Health Course",
      linkName: "/generate/health-course",
      icon: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/navbar/ic-blog.svg) center center / contain no-repeat",
    },
    {
      name: "Generate Daily Schedule",
      linkName: "/generate/schedule",
      icon: "url(https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/icons/navbar/ic-menu-item.svg) center center / contain no-repeat",
    },
  ];

  const logOut = () => {
    dispatch(logout());

    navigate("/login");
    toast.success("Logged out successfully");
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant={isTemporary ? "temporary" : "permanent"}
        open={isTemporary ? open : true}
        onClose={isTemporary ? () => setOpen(false) : undefined}
        {...(isTemporary && { ModalProps: { keepMounted: true } })}
      >
        <DrawerHeader>
          <IconButton
            onClick={open ? handleDrawerClose : handleDrawerOpen}
            size="small"
            sx={{
              alignItems: "center",
              justifyContent: "center",
              boxSizing: "border-box",
              outline: "0px",
              margin: "0px",
              cursor: "pointer",
              userSelect: "none",
              verticalAlign: "middle",
              appearance: "none",
              textDecoration: "none",
              textAlign: "center",
              flex: "0 0 auto",
              borderRadius: "50%",
              overflow: "visible",
              border: "1px solid rgba(145, 158, 171, 0.12)",
              backgroundColor: (theme) => theme.palette.background.default,
              padding: "4px",
              zIndex: 9999,
              position: "fixed",
              top: "24px",
              left: open ? "300px" : "calc(88px + 1px)",
              transform: "translateX(-50%)",
              transition: "left 0.3s ease",
              "&:hover": {
                backgroundColor: "rgba(145, 158, 171, 0.08)",
              },
            }}
          >
            {open ? (
              <ChevronLeftIcon width={16} height={16} />
            ) : (
              <ChevronRightIcon width={16} height={16} />
            )}
          </IconButton>
        </DrawerHeader>

        <Scrollbars
          autoHide
          style={{ border: 0, outline: 0 }}
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "#39454f",
                borderRadius: 3,
                height: "100%",
                outline: "none",
                border: "none",
              }}
            />
          )}
        >
          <Box
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Stack sx={{ mx: open ? 2 : "9px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {open && (
                    <ListSubheader
                      onClick={() => setCollapse(!collapse)}
                      disableSticky
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#637381",
                        textTransform: "uppercase",
                        fontSize: "0.6875rem",
                        cursor: "pointer",
                        lineHeight: 1.5,
                        fontWeight: 700,
                        padding: (theme) => theme.spacing(2, 1, 1, 0),
                        marginLeft: -1,
                        transition:
                          "color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        "&:hover": {
                          color: "white",
                          paddingLeft: "4px",
                          "& .chevron-icon": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      {collapse ? (
                        <ExpandMoreRounded
                          className="chevron-icon"
                          sx={{
                            opacity: 0,
                            transition:
                              "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                          }}
                          fontSize="small"
                        />
                      ) : (
                        <ChevronRightRounded
                          className="chevron-icon"
                          sx={{
                            opacity: 0,
                            transition:
                              "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                          }}
                          fontSize="small"
                        />
                      )}
                      Learn
                    </ListSubheader>
                  )}

                  <Collapse in={collapse}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                      }}
                    >
                      {menuItems.map((item, index) => (
                        <MenuItem
                          key={index}
                          linkName={item.linkName}
                          name={item.name}
                          icon={item.icon}
                          open={open}
                          multiWord={item.name.includes(" ")}
                        />
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Stack>
              {!open && (
                <Divider
                  sx={{ my: 2, borderColor: "rgba(145, 158, 171, 0.12)" }}
                />
              )}
              <Stack sx={{ mx: open ? 2 : "9px", mt: open ? 2 : "5px" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  {open && (
                    <ListSubheader
                      onClick={() => setCollapseGenerate(!collapseGenerate)}
                      disableSticky
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        color: "#637381",
                        textTransform: "uppercase",
                        fontSize: "0.6875rem",
                        cursor: "pointer",
                        lineHeight: 1.5,
                        fontWeight: 700,
                        padding: (theme) => theme.spacing(2, 1, 1, 0),
                        marginLeft: -1,
                        transition:
                          "color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                        "&:hover": {
                          color: "white",
                          paddingLeft: "4px",
                          "& .chevron-icon": {
                            opacity: 1,
                          },
                        },
                      }}
                    >
                      {collapseGenerate ? (
                        <ExpandMoreRounded
                          className="chevron-icon"
                          sx={{
                            opacity: 0,
                            transition:
                              "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                          }}
                          fontSize="small"
                        />
                      ) : (
                        <ChevronRightRounded
                          className="chevron-icon"
                          sx={{
                            opacity: 0,
                            transition:
                              "opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                          }}
                          fontSize="small"
                        />
                      )}
                      AI Generate
                    </ListSubheader>
                  )}
                  <Collapse in={collapseGenerate}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {generateItems.map((item, index) => (
                        <MenuItem
                          key={index}
                          linkName={item.linkName}
                          name={item.name}
                          icon={item.icon}
                          open={open}
                          multiWord={item.name.includes(" ")}
                        />
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              </Stack>
            </Box>
            {open && isLoggedIn && (
              <Stack>
                <Box
                  sx={{
                    padding: "40px 16px",
                    textAlign: "center",
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 60,
                      height: 60,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: "0 auto",
                      mb: 2,
                      backgroundColor: "#00A76F",
                      color: "white",
                      fontWeight: 800,
                      textTransform: "uppercase",
                    }}
                  >
                    {user?.fName[0] + user?.lName[0]}
                  </Avatar>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, textTransform: "capitalize" }}
                    gutterBottom
                  >
                    {user?.fName} {user?.lName}
                  </Typography>
                  <Typography
                    color="#637381"
                    variant="body2"
                    noWrap
                    sx={{ mb: 2 }}
                  >
                    {user?.email}
                  </Typography>
                  <Button
                    onClick={logOut}
                    sx={{
                      bgcolor: "rgba(255, 86, 48, 0.16)",
                      color: "error.main",
                      "&:hover": {
                        bgcolor: "rgba(255, 86, 48, 0.20)",
                      },
                    }}
                    startIcon={
                      <Icon icon="eva:log-out-fill" width="24" height="24" />
                    }
                  >
                    Logout
                  </Button>
                </Box>
              </Stack>
            )}
          </Box>
        </Scrollbars>
      </Drawer>
    </Box>
  );
}
