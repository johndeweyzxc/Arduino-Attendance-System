import React from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import SchoolLogo from "./assets/images/school-logo.jpg";
import Background from "./assets/images/school-photo.jpg";
import LogoutIcon from "@mui/icons-material/Logout";
import DatasetIcon from "@mui/icons-material/Dataset";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { Attendance } from "./pages/Attendance";
import { Student } from "./pages/Student";
import { Register } from "./pages/Register";

function AppHeader() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#c43835" }}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <img
            alt="Logo of Colegio De Montesorri"
            src={SchoolLogo}
            style={{
              width: "5%",
              margin: ".25rem",
              borderRadius: "50%",
            }}
          />
          <Typography variant="h6">Colegio De Montesorri</Typography>
        </Box>
        <Box sx={{ flexGrow: 0, alignSelf: "center", marginRight: "1rem" }}>
          <Tooltip title="Logout">
            <IconButton color="inherit">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </AppBar>
  );
}

function AppBody() {
  return (
    <div className="w-full h-full font-inter">
      <img
        alt="Montesorri school building"
        src={Background}
        className="z-[-1] absolute w-full h-full object-cover"
      />
      <div className="absolute w-screen h-full z-[-1] bg-black/50" />
      <section className="w-full h-full flex flex-col justify-center items-center">
        <Typography
          variant="h5"
          sx={{
            color: "white",
            fontWeight: "Bold",
            letterSpacing: "1px",
            marginBottom: "1rem",
          }}
        >
          Welcome, Montessorian!
        </Typography>
        <Button
          color="error"
          startIcon={<DatasetIcon />}
          variant="contained"
          sx={{ width: "40%" }}
          onClick={() => (window.location.href = "/Attendance")}
        >
          Student Attendance
        </Button>
        <Button
          color="error"
          startIcon={<PersonIcon />}
          variant="contained"
          sx={{ width: "40%", marginTop: ".5rem", marginBottom: ".5rem" }}
          onClick={() => (window.location.href = "/Student")}
        >
          Student Records
        </Button>
        <Button
          color="warning"
          startIcon={<PersonAddIcon />}
          variant="contained"
          sx={{ width: "40%" }}
          onClick={() => (window.location.href = "/Register")}
        >
          Register
        </Button>
      </section>
    </div>
  );
}

function AppHome() {
  return (
    <div className="m-0 p-0 w-screen h-screen">
      <AppHeader />
      <AppBody />
    </div>
  );
}

function App() {
  let componentToRender = <AppHome />;
  switch (window.location.pathname) {
    case "/":
      componentToRender = <AppHome />;
      break;
    case "/Attendance":
      componentToRender = <Attendance />;
      break;
    case "/Student":
      componentToRender = <Student />;
      break;
    case "/Register":
      componentToRender = <Register />;
      break;
    default:
      break;
  }

  return componentToRender;
}

export default App;
