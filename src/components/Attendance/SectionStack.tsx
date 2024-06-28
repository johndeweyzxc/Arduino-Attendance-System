import {
  Card,
  CardActionArea,
  CardContent,
  Fab,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { STUDENTS } from "../StudentTable";
import Groups2Icon from "@mui/icons-material/Groups2";
import { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AddSection from "../AddSection";
import { APP_COLOR } from "../../Colors";
import { CurrentSections } from "../../models/Models";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminCol from "../../data/AdminCol";

export const SECTIONS = "SECTIONS";

interface SectionStackProps {
  PushStack: (stackName: string, stackValue: string) => void;
  SectionList: string[];
  HandleOpenAlert: (severity: string, message: string) => void;
  SelectedStackVal: string[];
}
export function SectionStack(props: SectionStackProps) {
  const selectedStrand = props.SelectedStackVal[0];

  const [sections, setSections] = useState<CurrentSections>({
    ABM: [],
    HUMSS: [],
    STEM: [],
    TVL: [],
  });
  useEffect(() => {
    const onReceivedSetions = (section: CurrentSections | null) => {
      if (section !== null) setSections(section);
    };
    const unsubscribe = AdminCol.ListenSection(onReceivedSetions);
    return () => {
      unsubscribe();
    };
  }, []);

  const [isAddSec, setIsAddSec] = useState<boolean>(false);
  const closeAddSec = () => setIsAddSec(false);
  const openAddSec = () => setIsAddSec(true);

  let sectionList: string[] = [];
  switch (selectedStrand) {
    case "ABM":
      sectionList = sections.ABM;
      break;
    case "HUMSS":
      sectionList = sections.HUMSS;
      break;
    case "STEM":
      sectionList = sections.STEM;
      break;
    case "TVL":
      sectionList = sections.TVL;
      break;
    default:
      break;
  }
  sectionList = sectionList.sort();

  const onDeleteSection = (sectionToRemove: string) => {
    const onDeletedSection = (success: boolean, message: string) => {
      if (success) {
        props.HandleOpenAlert("success", message);
      } else {
        props.HandleOpenAlert("error", message);
      }
    };

    AdminCol.DeleteSection(
      sections,
      selectedStrand,
      sectionToRemove,
      onDeletedSection
    );
  };

  return (
    <>
      {sectionList.map((section, index) => {
        const color = index % 2 === 0 ? "#e6a831" : "#f3e522";

        return (
          <Card
            sx={{ width: "100%", marginBottom: "1rem", backgroundColor: color }}
            onClick={() => {
              // * Current stack: [SECTIONS, ...]
              props.PushStack(STUDENTS, section);
              // * New stack: [STUDENTS, SECTIONS, ...]
            }}
            key={index}
          >
            <CardContent sx={{ cursor: "pointer" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Groups2Icon sx={{ marginRight: "1rem" }} />
                  <Typography variant="h5">Section {section}</Typography>
                </div>
                <Tooltip title="Delete section">
                  <IconButton
                    onClick={(event) => {
                      event?.stopPropagation();
                      onDeleteSection(section);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            </CardContent>
            <CardActionArea></CardActionArea>
          </Card>
        );
      })}
      <Tooltip title="Add section">
        <Fab sx={{ backgroundColor: APP_COLOR }} onClick={openAddSec}>
          <AddIcon />
        </Fab>
      </Tooltip>

      <AddSection
        CloseAddSec={closeAddSec}
        IsOpen={isAddSec}
        CurrentSections={sections}
        HandleOpenAlert={props.HandleOpenAlert}
        Strand={selectedStrand}
      />
    </>
  );
}
