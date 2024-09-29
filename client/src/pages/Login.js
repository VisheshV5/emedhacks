import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  CardContent,
  CardHeader,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { login } from "../actions/auth";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    email: "",
  });
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { message } = useSelector((state) => state.message);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onChangeEmail = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!emailRegex.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Please enter a valid email address",
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "",
      }));
    }
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    setErrors({ ...errors, password: "" });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (!email) {
      newErrors.email = "Email address is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors({ ...errors, ...newErrors });

    if (Object.keys(newErrors).length === 0) {
      try {
        await dispatch(login(email, password));
        navigate("/dashboard");
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    } else {
      setError(false);
      setLoading(false);
    }
  };

  if (isLoggedIn) {
    navigate("/dashboard");
  }

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
            <Typography variant="h3">Hi, Welcome Back</Typography>
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
                Sign in to your account
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
                  fontWeight: 500,
                }}
              >
                Don't have an account?&nbsp;
                <Typography
                  onClick={() => navigate("/register")}
                  sx={{ "&:hover": { textDecoration: "underline" } }}
                  variant="subtitle2"
                  color="#00A76F"
                  fontWeight={600}
                >
                  Get started
                </Typography>
              </Typography>
            }
          />
          <CardContent>
            <TextField
              fullWidth
              margin="normal"
              label="Email address"
              name="email"
              value={email}
              error={Boolean(errors.email)}
              helperText={errors.email}
              onChange={onChangeEmail}
              variant="outlined"
              required
              autoFocus
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              name="password"
              value={password}
              error={Boolean(errors.password)}
              helperText={errors.password}
              onChange={onChangePassword}
              type={showPassword ? "text" : "password"}
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
              required
            />
            {message && error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {message}
              </Alert>
            )}
            <Box
              sx={{ display: "flex", justifyContent: "space-between", ml: 1 }}
            >
              <Link to="/forgot-password" style={{ textDecoration: "none" }}>
                <Typography variant="body2" color="primary">
                  Forgot password?
                </Typography>
              </Link>
            </Box>
            <LoadingButton
              type="submit"
              variant="contained"
              onClick={handleLogin}
              loading={loading}
              sx={{ mt: 5, width: "100%" }}
            >
              Sign in
            </LoadingButton>
          </CardContent>
        </Box>
      </Box>
    </>
  );
}
