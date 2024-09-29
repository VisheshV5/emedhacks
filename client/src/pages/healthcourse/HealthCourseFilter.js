import { Icon } from "@iconify/react/dist/iconify.js";
import {
  Autocomplete,
  Badge,
  Box,
  Checkbox,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  SvgIcon,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { createSvgIcon } from "@mui/material/utils";
import { DatePicker } from "@mui/x-date-pickers";
import React from "react";
import { checkedIcon, dateIcon } from "../../common/PickerIcon";

const gradeLevels = [
  "Preschool",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
  "6th Grade",
  "7th Grade",
  "8th Grade",
  "9th Grade (Freshman)",
  "10th Grade (Sophomore)",
  "11th Grade (Junior)",
  "12th Grade (Senior)",
  "College/University (Undergraduate)",
  "Graduate School (Master's)",
  "Graduate School (Doctorate/Ph.D.)",
  "Medical School",
  "Law School",
  "Business School",
  "Engineering School",
  "Nursing School",
  "Dental School",
  "Pharmacy School",
  "Veterinary School",
  "Pre-Med",
  "Pre-Law",
  "Pre-Business",
  "Pre-Engineering",
  "Pre-Nursing",
  "Pre-Dental",
  "Pre-Pharmacy",
  "Pre-Veterinary",
];

const customIcon = (
  <Box
    sx={{
      borderRadius: 1,
      margin: "2px",
      width: 18,
      height: 18,
      border: "1.5px solid #919EAB",
      ".Mui-focusVisible &": {
        outline: "2px auto rgba(19,124,189,.6)",
        outlineOffset: 2,
      },
    }}
  />
);

export default function Filters({
  open,
  setOpen,
  filterValues,
  setFilterValues,
}) {
  const handleDateChange = (date, field) => {
    setFilterValues(prev => ({ ...prev, [field]: date }));
  };

  const handleAutocompleteChange = (event, value) => {
    setFilterValues(prev => ({ ...prev, gradeLevels: value }));
  };

  const handleCheckboxChange = (event, field) => {
    const { checked } = event.target;
    setFilterValues(prev => {
      const newDifficulties = checked
        ? [...prev.difficulty, field]
        : prev.difficulty.filter(diff => diff !== field);
      // console.log(newDifficulties);
      return { ...prev, difficulty: newDifficulties };
    });
  };

  const handleReset = () => {
    setFilterValues({
      gradeLevels: [],
      difficulty: [],
    });
  };

  const DateIcon = createSvgIcon(dateIcon);

  return (
    <Drawer
      open={open}
      variant="temporary"
      anchor="right"
      elevation={16}
      onClose={() => setOpen(false)}
      hideBackdrop
      sx={{
        "& .MuiDrawer-paper": {
          position: "absolute",
          height: "100%",
          width: "320px",
          outline: "0px",
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(28, 37, 46, 0.9)",

          backgroundPosition: "right top, left bottom",
          boxShadow: "-40px 40px 80px -8px rgba(0 0 0 / 0.24)",
          backgroundSize: "50%, 50%",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          pr: 1,
        }}
      >
        <Typography
          variant="h6"
          fontWeight={600}
          fontSize="1.125rem"
          component={DialogTitle}
          sx={{ flexGrow: 1 }}
        >
          Filters
        </Typography>
        <Tooltip title="Reset">
          <Badge color="error" variant="dot" overlap="circular">
            <IconButton sx={{ flex: "0 0 auto" }} onClick={handleReset}>
              <Icon icon="solar:restart-bold" width="20" height="20" />
            </IconButton>
          </Badge>
        </Tooltip>
        <IconButton sx={{ flex: "0 0 auto" }} onClick={() => setOpen(false)}>
          <Icon icon="mingcute:close-line" width="20" height="20" />
        </IconButton>
      </Box>
      <Divider sx={{ borderStyle: "dashed" }} />
      <Box
        sx={{
          padding: theme => theme.spacing(3, 2.5),
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <div>
          <Typography fontWeight="bold" variant="subtitle2">
            Created at
          </Typography>
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="Start Date"
              value={filterValues.startDate}
              onChange={date => handleDateChange(date, "startDate")}
              slots={{
                openPickerIcon: DateIcon,
              }}
            />
          </FormControl>
          <FormControl fullWidth margin="normal">
            <DatePicker
              label="End Date"
              value={filterValues.endDate}
              onChange={date => handleDateChange(date, "endDate")}
              slots={{
                openPickerIcon: DateIcon,
              }}
            />
          </FormControl>
        </div>
        <div>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              multiple
              options={gradeLevels}
              value={filterValues.gradeLevels}
              onChange={handleAutocompleteChange}
              limitTags={1}
              renderInput={params => <TextField placeholder="Job Keywords" />}
              ChipProps={{
                sx: {
                  margin: "3px",
                  maxWidth: "calc(100% - 6px)",
                  fontSize: "0.8125rem",
                  height: "28px",
                  backgroundColor: "rgba(145 158 171 / 0.16)",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "rgba(145 158 171 / 0.24)",
                  },
                },
                icon: (
                  <Icon
                    icon="solar:square-academic-cap-bold"
                    width="24"
                    height="24"
                  />
                ),
              }}
              sx={{
                "& .MuiAutocomplete-popper": {
                  height: 10,
                },
              }}
            />
          </FormControl>
        </div>
      </Box>
    </Drawer>
  );
}
