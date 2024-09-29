import React, { useState } from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Button,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import {
  Key,
  Visibility,
  VisibilityOff,
  SendRounded,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { register, resetPasswordRequest } from "../actions/auth";

import { useSnackbar } from "../common/components/SnackbarContext";
import { toast } from "react-toastify";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [resetError, setResetError] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState({
    fName: "",
    lName: "",
    password: "",
    email: "",
    resetEmail: "",
    username: "",
  });

  const { message } = useSelector((state) => state.message);
  const snackbar = useSnackbar();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (e) => e.preventDefault();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const validateEmail = (email) =>
    /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email);

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    const newErrors = {};
    if (!passwordRegex.test(value)) {
      newErrors.password =
        "Password must be at least 6 characters long and contain at least one letter, one digit, and one special character.";
    }
    setErrors({ ...errors, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    const newErrors = {};

    if (!fName) newErrors.fName = "Required";
    if (!lName) newErrors.lName = "Required";
    if (!password) newErrors.password = "Password is required";
    if (!email) newErrors.email = "Email is required";
    if (!username) newErrors.username = "Username is required";

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0 && validateEmail(email)) {
      dispatch(register(fName, lName, username, email, password))
        .then(() => {
          navigate("/login");
          toast.success("Registration Successful! Please login.");
        })
        .catch(() => {
          setError(true);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetLoading(true);

    if (resetEmail) {
      dispatch(resetPasswordRequest(resetEmail))
        .then(() => {
          setResetLoading(false);
          handleClose();
          setResetEmail("");
          toast.success(
            "Password reset email sent. Check your email for instructions."
          );
        })
        .catch(() => {
          setResetLoading(false);
          setResetError(true);
        });
    } else {
      setErrors({ ...errors, resetEmail: "Email is required" });
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "5vh",
        }}
      >
        <Box
          sx={{
            flex: 1,
            padding: 3,
            gap: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <Typography variant="h3">Welcome to WellAware AI</Typography>
            <Typography color="text.secondary" align="center" sx={{ mt: 2 }}>
              Learn through personalized experiences.
            </Typography>
          </div>
          <Box
            alt="dashboard illustration"
            component="img"
            src="https://pub-c5e31b5cdafb419fb247a8ac2e78df7a.r2.dev/public/assets/illustrations/illustration-dashboard.webp"
            sx={{ width: "100%", aspectRatio: 4 / 3, objectFit: "cover" }}
          />
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box
          sx={{
            flex: 1,
            padding: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <CardHeader
            title={
              <Typography variant="h5" fontWeight={700}>
                Create an account
              </Typography>
            }
            subheader={
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Already have an account?&nbsp;
                <Typography
                  onClick={() => navigate("/login")}
                  sx={{
                    "&:hover": { textDecoration: "underline" },
                    cursor: "pointer",
                  }}
                  variant="subtitle2"
                  color="#00A76F"
                  fontWeight={600}
                >
                  Sign in
                </Typography>
              </Typography>
            }
          />
          <CardContent>
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                error={Boolean(errors.fName)}
                helperText={errors.fName}
                margin={errors.fName ? "dense" : "normal"}
                label="First Name"
                fullWidth
                name="fName"
                value={fName}
                onChange={(e) => {
                  setFName(e.target.value);
                  setErrors({ ...errors, fName: "" });
                  setDisabled(false);
                }}
                variant="outlined"
              />
              <TextField
                error={Boolean(errors.lName)}
                helperText={errors.lName}
                margin={errors.lName ? "dense" : "normal"}
                label="Last Name"
                fullWidth
                name="lName"
                value={lName}
                onChange={(e) => {
                  setLName(e.target.value);
                  setErrors({ ...errors, lName: "" });
                  setDisabled(false);
                }}
                variant="outlined"
              />
            </Box>
            <TextField
              fullWidth
              error={Boolean(errors.username)}
              helperText={errors.username}
              margin={errors.username ? "dense" : "normal"}
              label="Username"
              name="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setErrors({ ...errors, username: "" });
                setDisabled(false);
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              error={Boolean(errors.email)}
              helperText={errors.email}
              margin={errors.email ? "dense" : "normal"}
              label="Email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors({ ...errors, email: "" });
                setDisabled(false);
                if (!validateEmail(e.target.value)) {
                  setErrors({ ...errors, email: "Invalid email address" });
                }
              }}
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setDisabled(false);
                if (e.target.value.length === 0) {
                  setErrors({ ...errors, password: "" });
                } else {
                  validatePassword(e.target.value);
                }
              }}
              type={showPassword ? "text" : "password"}
              error={Boolean(errors.password)}
              helperText={
                /Password is/.test(errors.password) && "Password is required"
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                An error occurred during registration. Please try again.
              </Alert>
            )}
            <LoadingButton
              onClick={handleRegister}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={loading}
              sx={{ mt: 3 }}
            >
              Sign Up
            </LoadingButton>
          </CardContent>
        </Box>
      </Box>
    </>
  );
};

export default Register;
