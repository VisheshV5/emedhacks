import { Search } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  InputAdornment,
  Pagination,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import React, { useEffect, useState } from "react";
import noImageCropped from "../../images/noImageCropped.png";
import CourseCard from "./HealthCourseCard";

import { getAllCourses } from "../../services/course.service";

const LoadingCard = () => {
  return (
    <Card
      sx={{
        borderRadius: "15px",
        mb: 3,
      }}
    >
      <Skeleton
        sx={{ height: 151, width: "auto", margin: "10px", borderRadius: 2 }}
        animation="wave"
        variant="rectangular"
      />
      <CardContent>
        <Box sx={{ width: 300 }}>
          <Typography component="div" fontSize="10px" gutterBottom>
            <Skeleton width="60%" />
          </Typography>
          <Typography component="div" fontSize="18px" gutterBottom>
            <Skeleton width="80%" />
          </Typography>
          <Typography
            variant="p"
            color="text.secondary"
            component="div"
            gutterBottom
          >
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const Courses = () => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOptions, setSearchOptions] = useState([]);
  const [allCourses, setAllCourses] = useState();
  const [page, setPage] = useState(1);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  // const [filter, setFilter] = useState("");
  // const [currentPage, setCurrentPage] = useState(1);
  const [coursesPerPage] = useState(9);
  // const [filterValues, setFilterValues] = useState({});
  // const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      setLoading(true);

      try {
        const courses = await getAllCourses();
        setAllCourses(courses.courses.reverse());

        setLoading(false);
      } catch (err) {
        // console.log(err);
      }
    };

    getCourses();
  }, []);

  // const handleOpenDialog = () => {
  //   setDialogOpen(true);
  // };

  // const handleCloseDialog = () => {
  //   setDialogOpen(false);
  // };

  // const handleSearchChange = e => {
  //   setSearchTerm(e.target.value);
  //   setCurrentPage(1);
  // };

  // const handleFilterChange = e => {
  //   setFilter(e.target.value);
  //   setCurrentPage(1);
  // };

  // const handlePageChange = (event, value) => {
  //   setCurrentPage(value);
  // };

  useEffect(() => {
    setSearchOptions(
      allCourses?.map((course) => ({
        id: course._id,
        title: course.title,
        image: course.imageUrl,
      }))
    );
  }, [allCourses]);

  const totalPages = Math.ceil(allCourses?.length / coursesPerPage);
  const currentCourses = allCourses?.slice(
    (page - 1) * coursesPerPage,
    page * coursesPerPage
  );

  return (
    <>
      <Grid
        sx={{
          display: "flex",
          pb: 2,
        }}
      >
        <Autocomplete
          fullWidth
          freeSolo
          options={
            !searchTerm ? [{ title: "Please enter keywords" }] : searchOptions
          }
          getOptionLabel={(option) => option.title || ""}
          inputValue={searchTerm}
          onInputChange={(event, newInputValue) => {
            setSearchTerm(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              label="Search"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          )}
          getOptionDisabled={(option) =>
            option.title === "Please enter keywords"
          }
          renderOption={(props, option, { inputValue }) => {
            const { key, ...optionProps } = props;

            const matches = match(option.title, inputValue, {
              insideWords: true,
            });
            const parts = parse(option.title, matches);
            return (
              <Box key={option._id} sx={{ maxHeight: "100%" }} {...optionProps}>
                {searchTerm && (
                  <img
                    src={option.image || noImageCropped}
                    alt="search option for the quiz results"
                    width="40"
                    height="40"
                    style={{
                      marginRight: 10,
                      borderRadius: "8px",
                      filter: "brightness(50%)",
                    }}
                  />
                )}
                {parts.map((part, index) => (
                  <span
                    key={index}
                    style={{
                      fontWeight: part.highlight ? 700 : 400,
                    }}
                  >
                    {part.text}
                  </span>
                ))}
              </Box>
            );
          }}
        />
      </Grid>

      <Grid container spacing={3}>
        {loading &&
          Array.from({ length: 9 }).map((item, index) => (
            <Grid
              item
              xl={3}
              lg={4}
              md={6}
              xs={12}
              key={`loading-card-${index}`}
            >
              <LoadingCard />
            </Grid>
          ))}
      </Grid>

      {!loading && (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {currentCourses?.map((course) => (
            <Grid
              item
              xl={3}
              lg={4}
              md={6}
              xs={12}
              key={course._id}
              sx={{ minHeight: "100%" }}
            >
              <CourseCard course={course} />
            </Grid>
          ))}
        </Grid>
      )}

      <Grid container justifyContent="center" sx={{ marginTop: 3 }}>
        {totalPages > 1 && (
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
            size="large"
          />
        )}
      </Grid>
    </>
  );
};

export default Courses;
