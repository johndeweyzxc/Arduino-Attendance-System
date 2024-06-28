import { useEffect, useState } from "react";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./App.css";
import Background from "./assets/images/school-photo.jpg";
import DatasetIcon from "@mui/icons-material/Dataset";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Button, Typography } from "@mui/material";
import { Attendance } from "./pages/Attendance";
import { Student } from "./pages/Student";
import { Register } from "./pages/Register";
import AppAuth from "./auth/AppAuth";
import Login from "./components/Login";
import AppHeader from "./components/AppHeader";

function AppBody() {
  return (
    <div className="w-full h-full font-inter">
      <img
        alt="Montesorri school building"
        src={Background}
        className="z-[-1] absolute w-full h-full object-cover"
      />
      <div className="absolute w-screen h-full z-[-1] bg-black/50" />
      <section className="w-full h-full flex justify-center items-center">
        <div className="w-[40%] h-full flex flex-col justify-center items-center max-md:w-[70%] max-sm:w-[90%]">
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
            sx={{ width: "100%" }}
            onClick={() => (window.location.href = "/Attendance")}
          >
            Student Attendance
          </Button>
          <Button
            color="error"
            startIcon={<PersonIcon />}
            variant="contained"
            sx={{ width: "100%", marginTop: ".5rem", marginBottom: ".5rem" }}
            onClick={() => (window.location.href = "/Student")}
          >
            Student Records
          </Button>
          <Button
            color="warning"
            startIcon={<PersonAddIcon />}
            variant="contained"
            sx={{ width: "100%" }}
            onClick={() => (window.location.href = "/Register")}
          >
            Register
          </Button>
        </div>
      </section>
    </div>
  );
}

function AppHome() {
  return (
    <div className="m-0 p-0 w-screen h-screen">
      <AppHeader IsLogin={false} />
      <AppBody />
      <div className="w-screen py-4 px-8 flex justify-end border-t-2 border-solid border-[#c43835]">
        <p>A. Soriano Highway, Timalan, Naic, Cavite, Philippines</p>
      </div>
    </div>
  );
}

function App() {
  const [getIsLoggedIn, setIsLoggedIn] = useState(false);
  const cb = (isLoggedIn: boolean) => setIsLoggedIn(isLoggedIn);

  let componentToRender = <AppHome />;

  useEffect(() => {
    const unsubscribe = AppAuth.ListenAuth(cb);
    return () => {
      // Cleanup listener when the component unmounts
      unsubscribe();
    };
  }, []);

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

  if (getIsLoggedIn) {
    return componentToRender;
  } else {
    return <Login />;
  }
}

export default App;
