import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Stepper,
  Card,
  Fade,
  Autocomplete,
  FormControl,
  FormHelperText,
  CardHeader,
  Chip,
  Divider,
  CardContent,
  LinearProgress,
  Step,
  StepLabel,
  Box,
  Grid,
  Typography,
  TextField,
  MenuItem,
  Slider,
} from "@mui/material";
import { Slide } from "@mui/material";
import { AutoAwesome } from "@mui/icons-material";
import { createPreferences } from "../services/user.service";
import { useSelector } from "react-redux";
import loadingImage from "../images/loading.png";

import { useNavigate } from "react-router";

const steps = ["Personal", "Work", "Condition"];

const loadingMessages = [
  "Finding the perfect personalization for you...",
  "Fetching the resources...",
  "Planning out your day...",
];

const stepDescriptions = [
  { title: "Personal details" },
  //  condition, amount, age, role, hours
  { title: "Work details" },
  { title: "Health condition" },
];

const roles = [
  "CEO",
  "Hedge Fund Manager",
  "Investment Banker",
  "Tech Entrepreneur",
  "Surgeon",
  "Lawyer",
  "Software Engineer",
  "Real Estate Developer",
  "Consultant",
  "College Professor",
  "Accountant",
  "Teacher",
  "Electrician",
  "Plumber",
  "Factory Worker",
  "Retail Store Employee",
  "Customer Service Representative",
  "Delivery Driver",
  "Fast Food Worker",
  "Janitor",
  "Street Vendor",
  "Farm Laborer",
  "Day Laborer",
  "Unemployed",
];
const knowledge_amount = [
  { num: 0, title: "No clue" },
  { num: 1, title: "A little bit" },
  { num: 2, title: "A decent amount" },
  { num: 3, title: "More than average" },
  { num: 4, title: "A lot" },
  { num: 5, title: "Expert" },
];

const CreateSchedule = () => {
  const { user } = useSelector((state) => state.auth);
  const [returnData, setReturnData] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    age: 13,
    location: "",
    role: roles[0],
    amount: knowledge_amount[2].num,
    hours: [8, 9],
    description: "",
  });
  const [sliding, setSliding] = useState(true);
  const [slideDirection, setSlideDirection] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [dreamJob, setDreamJob] = useState("");
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const slideRef = useRef();

  useEffect(() => {
    if (loading) {
      const intervalId = setInterval(() => {
        const nextMessage =
          loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
        setLoadingText(nextMessage);
      }, 2000);
      return () => clearInterval(intervalId);
    }
  }, [loading]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      setSliding(false);
      setTimeout(() => {
        submitProfileData();
      }, 300);
    } else {
      setSlideDirection("next");
      setSliding(false);
      setTimeout(() => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
        setSliding(true);
      }, 300);
    }
  };

  const handleBack = () => {
    setSlideDirection("back");
    setSliding(false);

    setTimeout(() => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
      setSliding(true);
    }, 350);
  };

  const submitProfileData = async () => {
    setLoading(true);

    try {
      setSubmitted(true);

      const data = await createPreferences(user.id, formData);
      setReturnData(data.message);

      console.log(data.message);

      setLoading(false);
      navigate("/dashboard");

      setSliding(true);
    } catch (error) {
      console.error("Error submitting profile:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleLocationChange = (result) => {
    setFormData({
      ...formData,
      location: result,
    });
  };

  const handleSliderChange = (e, newValue) =>
    setFormData({ ...formData, hours: newValue });

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              label="Name*"
              name="name"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 1 }}
              fullWidth
            />
            <TextField
              label="Age*"
              name="age"
              value={formData.age}
              onChange={handleChange}
              type="number"
              InputProps={{ inputProps: { min: 13 } }}
              margin="normal"
              fullWidth
            />
            {/* <div></div> */}
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              margin="normal"
              fullWidth
            />
          </>
        );

      case 1:
        return (
          <>
            <Typography gutterBottom sx={{ mt: 2 }}>
              Range of hours working every day
            </Typography>
            <Slider
              value={formData.hours}
              onChange={handleSliderChange}
              valueLabelDisplay="auto"
              min={2}
              max={18}
            />
            <Typography
              fontWeight={600}
            >{`${formData.hours[0]}-${formData.hours[1]} hours per day`}</Typography>

            <FormControl margin="normal" fullWidth sx={{ mt: 5 }}>
              <Autocomplete
                id="skills-input"
                options={roles}
                value={formData.role}
                onChange={(e, newValue) =>
                  setFormData({ ...formData, role: newValue })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Role*"
                    placeholder="Roles"
                  />
                )}
              />
              {console.log(formData.role)}
            </FormControl>
          </>
        );
      case 2:
        return (
          <>
            <TextField
              select
              label="Knowledge about your condition*"
              name="experience"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              margin="auto"
              fullWidth
            >
              {knowledge_amount.map((amt) => (
                <MenuItem key={amt.num} value={amt.num}>
                  {amt.title}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              label="Describe your condition*"
              fullWidth
              margin="normal"
              value={formData.description}
              multiline
              minRows={4}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </>
        );
      default:
        return "Unknown step";
    }
  };

  return (
    <Box sx={{ width: "90%", overflow: "hidden" }} ref={slideRef}>
      <Box sx={{ width: "60%", margin: "auto" }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <br />
        {!submitted ? (
          <Slide
            direction={
              slideDirection === "next" && sliding
                ? "right"
                : slideDirection === "back" && !sliding
                ? "right"
                : "left"
            }
            in={sliding}
            container={slideRef.current}
            mountOnEnter
            unmountOnExit
          >
            <Card sx={{ mt: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <CardHeader
                  sx={{ padding: 0 }}
                  title={stepDescriptions[activeStep].title}
                  subheader={stepDescriptions[activeStep].subheader}
                />
                <Divider sx={{ margin: (theme) => theme.spacing(2, -3, 4) }} />
                {getStepContent(activeStep)}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 4,
                  }}
                >
                  <Button disabled={activeStep === 0} onClick={handleBack}>
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Finish" : "Next"}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Slide>
        ) : (
          <>
            {loading && (
              <Card>
                <CardContent
                  sx={{
                    p: 3,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src={loadingImage}
                    alt="Loading image"
                    width="75%"
                    style={{ margin: "auto" }}
                  />
                  <LinearProgress sx={{ my: 3 }} />
                  <Typography variant="h4" align="center">
                    {loadingText}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default CreateSchedule;
