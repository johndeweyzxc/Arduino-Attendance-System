import { AppBar, Box, IconButton, Tooltip, Typography } from "@mui/material";
import SchoolLogo from "../assets/images/school-logo.jpg";
import LogoutIcon from "@mui/icons-material/Logout";
import AppAuth from "../auth/AppAuth";

interface AppHeaderProps {
  IsLogin: boolean;
}
export default function AppHeader(props: AppHeaderProps) {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#c43835" }}>
      <Box sx={{ display: "flex" }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <img
            alt="Logo of Colegio De Montesorri"
            src={SchoolLogo}
            style={{
              width: "50px",
              height: "50px",
              margin: ".5rem",
              marginRight: "1rem",
              borderRadius: "50%",
            }}
          />
          <Typography variant="h6">Colegio De Montesorri</Typography>
        </Box>
        {props.IsLogin ? null : (
          <Box sx={{ flexGrow: 0, alignSelf: "center", marginRight: "1rem" }}>
            <Tooltip title="Logout">
              <IconButton
                color="inherit"
                onClick={() => AppAuth.SignOutAsAdmin()}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </AppBar>
  );
}
