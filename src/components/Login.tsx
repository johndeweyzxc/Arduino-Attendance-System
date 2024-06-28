import { ChangeEvent, FormEvent, useState } from "react";
import AppAuth from "../auth/AppAuth";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import AppHeader from "./AppHeader";

export default function Login() {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    AppAuth.SignInAdmin(loginData.username, loginData.password);
    setLoginData({
      username: "",
      password: "",
    });
  };

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <AppHeader IsLogin={true} />
      <div className="w-screen h-screen flex justify-center items-center flex-col">
        <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
          Login as Admin
        </Typography>
        <form
          className="flex flex-col w-[40%] max-md:w-[70%] max-sm:w-[90%]"
          onSubmit={handleSubmit}
        >
          <FormControl variant="outlined">
            <InputLabel>Username</InputLabel>
            <OutlinedInput
              type="text"
              name="username"
              label="Username"
              onChange={onChangeInput}
            />
          </FormControl>
          <FormControl
            variant="outlined"
            sx={{ marginTop: "1rem", marginBottom: "1rem" }}
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              type={showPassword ? "text" : "password"}
              name="password"
              label="Password"
              onChange={onChangeInput}
            />
          </FormControl>
          <Button
            size="large"
            variant="contained"
            startIcon={<LoginIcon />}
            sx={{ width: "100%" }}
            type="submit"
          >
            Login
          </Button>
        </form>
      </div>
      <div className="w-screen py-4 px-8 flex justify-end border-t-2 border-solid border-[#c43835]">
        <p>A. Soriano Highway, Timalan, Naic, Cavite, Philippines</p>
      </div>
    </>
  );
}
