import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { STRANDS } from "./StrandStack";
import SchoolIcon from "@mui/icons-material/School";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

export const GRADE_LEVELS = "GRADE_LEVELS";

interface GradeLevelStackProps {
  PushStack: (stackName: string, stackValue: string) => void;
}
export function LevelStack(props: GradeLevelStackProps) {
  return (
    <>
      <Card
        sx={{
          width: "100%",
          marginBottom: "1rem",
          backgroundColor: "#f3e522",
        }}
        onClick={() => {
          // * CURRENT STACK: [GRADE LEVELS]
          props.PushStack(STRANDS, "11");
          // * EXPECTED STACK: [STRANDS, GRADE LEVELS]
        }}
      >
        <CardActionArea>
          <CardContent>
            <div className="flex items-center">
              <SchoolOutlinedIcon sx={{ marginRight: "1rem" }} />
              <Typography variant="h5">Grade 11</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
      <Card
        sx={{
          width: "100%",
          marginBottom: "1rem",
          backgroundColor: "#e6a831",
        }}
        onClick={() => {
          // * CURRENT STACK: [GRADE LEVELS]
          props.PushStack(STRANDS, "12");
          // * EXPECTED STACK: [STRANDS, GRADE LEVELS]
        }}
      >
        <CardActionArea>
          <CardContent>
            <div className="flex items-center">
              <SchoolIcon sx={{ marginRight: "1rem" }} />
              <Typography variant="h5">Grade 12</Typography>
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}
