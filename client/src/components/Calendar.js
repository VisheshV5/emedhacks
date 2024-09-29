import React from "react";
import { Box, Card, Divider, Grid, Typography } from "@mui/material";

function DailyCalendar({ dailyCalendar }) {
  return (
    <Box sx={{ width: "100%", mt: 1 }}>
      {dailyCalendar?.map((block, index) => (
        <>
          <Box
            style={{
              padding: "16px",
              width: "100%",
              display: "flex",
            }}
          >
            <Typography
              sx={{
                marginRight: "auto",
                color: "#00a76f",
                width: "100%",
              }}
              variant="body2"
              fontWeight={700}
            >
              {block.substring(0, block.indexOf("-"))}
            </Typography>
            <Typography
              sx={{
                marginLeft: "auto",
                textAlign: "right",
                width: "300%",
              }}
              variant="body2"
              fontWeight={700}
            >
              {block.substring(block.indexOf("-") + 1)}
            </Typography>
          </Box>
          {index != dailyCalendar.length - 1 && (
            <Divider
              sx={{
                borderColor: "white",
              }}
            />
          )}
        </>
      ))}
    </Box>
  );
}

export default DailyCalendar;
