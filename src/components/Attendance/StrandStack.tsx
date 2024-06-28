import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import { SECTIONS } from "./SectionStack";
import BlenderOutlinedIcon from "@mui/icons-material/BlenderOutlined";
import CalculateOutlinedIcon from "@mui/icons-material/CalculateOutlined";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import BiotechOutlinedIcon from "@mui/icons-material/BiotechOutlined";
import { useEffect, useState } from "react";
import AdminCol from "../../data/AdminCol";
import { CurrentSections } from "../../models/Models";

export const STRANDS = "STRANDS";

interface StrandStackProps {
  PushStack: (stackName: string, stackValue: string) => void;
  AppendSectionList: (list: string[]) => void;
}
export function StrandStack(props: StrandStackProps) {
  const [sections, setSections] = useState<CurrentSections>({
    ABM: [],
    HUMSS: [],
    STEM: [],
    TVL: [],
  });

  useEffect(() => {
    const onReceiveAdminData = (adminData: CurrentSections | null) => {
      if (adminData !== null) setSections(adminData);
    };
    AdminCol.GetSections(onReceiveAdminData);
  }, []);

  return (
    <>
      {Object.entries(sections).map(([key, value], index) => {
        let iconToRender = <BlenderOutlinedIcon sx={{ marginRight: "1rem" }} />;
        switch (key) {
          case "ABM":
            iconToRender = (
              <CalculateOutlinedIcon sx={{ marginRight: "1rem" }} />
            );
            break;
          case "HUMSS":
            iconToRender = <GavelOutlinedIcon sx={{ marginRight: "1rem" }} />;
            break;
          case "STEM":
            iconToRender = <BiotechOutlinedIcon sx={{ marginRight: "1rem" }} />;
            break;
          default:
            break;
        }
        const color = index % 2 === 0 ? "#f3e522" : "#e6a831";

        if (value.length === 0) return null;
        return (
          <Card
            sx={{
              width: "100%",
              marginBottom: "1rem",
              backgroundColor: color,
            }}
            onClick={() => {
              // * Current stack: [STRANDS, ...]
              props.PushStack(SECTIONS, key);
              props.AppendSectionList(value);
              // * New stack: [SECTIONS, STRANDS, ...]
            }}
            key={key}
          >
            <CardActionArea>
              <CardContent>
                <div className="flex items-center">
                  {iconToRender}
                  <Typography variant="h5">{key}</Typography>
                </div>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </>
  );
}
