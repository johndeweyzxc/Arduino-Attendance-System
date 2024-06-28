import { AppBar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { GRADE_LEVELS } from "./LevelStack";
import { STRANDS } from "./StrandStack";
import { SECTIONS } from "./SectionStack";
import { STUDENTS } from "../StudentTable";
import { MONTHS } from "./MonthsStack";
import { ATTENDANCES } from "./TableStack";

interface AttendanceHeaderParams {
  PopStack: () => void;
  SelectedStack: string[];
}
export default function AttendanceHeader(props: AttendanceHeaderParams) {
  const stackCopy = [...props.SelectedStack].reverse();
  let headerValue = "Attendance";

  stackCopy.forEach((item) => {
    switch (item) {
      case GRADE_LEVELS:
        headerValue += " > Grade Levels";
        break;
      case STRANDS:
        headerValue += " > Strands";
        break;
      case SECTIONS:
        headerValue += " > Sections";
        break;
      case STUDENTS:
        headerValue += " > Students";
        break;
      case MONTHS:
        headerValue += " > Months";
        break;
      case ATTENDANCES:
        headerValue += " > Attendances";
        break;
    }
  });

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#c43835", width: "100vw" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", margin: ".5rem" }}>
        <Tooltip title="Back">
          <IconButton
            size="large"
            color="inherit"
            onClick={() => {
              if (props.SelectedStack[0] === "GRADE_LEVELS") {
                window.location.href = "/";
              } else {
                props.PopStack();
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6">{headerValue}</Typography>
      </Box>
    </AppBar>
  );
}
