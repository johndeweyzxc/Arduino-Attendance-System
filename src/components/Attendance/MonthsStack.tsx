import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { ATTENDANCES } from "./TableStack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export const MONTHS = "MONTHS";

const MAP_MONTH_NUM: Map<string, string> = new Map<string, string>([
  ["January", "01"],
  ["February", "02"],
  ["March", "03"],
  ["April", "04"],
  ["May", "05"],
  ["June", "06"],
  ["July", "07"],
  ["August", "08"],
  ["September", "09"],
  ["October", "10"],
  ["November", "11"],
  ["December", "12"],
]);

interface MonthsStackProps {
  PushStack: (stackName: string, stackValue: string | Object) => void;
}
export function MonthsStack(props: MonthsStackProps) {
  return (
    <div className="flex flex-wrap justify-center">
      {Array.from(MAP_MONTH_NUM.entries()).map(([key, value], index) => {
        const color = index % 2 === 0 ? "#f3e522" : "#e6a831";

        return (
          <Card
            sx={{
              width: 300,
              marginBottom: ".5rem",
              marginLeft: ".5rem",
              marginRight: ".5rem",
              backgroundColor: color,
            }}
            onClick={() => {
              // * CURRENT STACK: [MONTHS, ...]
              props.PushStack(ATTENDANCES, value);
              // * EXPECTED STACK: [ATTENDANCES, MONTHS, ...]
            }}
            key={key}
          >
            <CardActionArea>
              <CardContent>
                <div className="flex items-center">
                  <CalendarMonthIcon sx={{ marginRight: "1rem" }} />
                  <Typography variant="h5">{key}</Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
}
