import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import React, { ChangeEvent, useState } from "react";
import { CurrentSections } from "../models/Models";
import AdminCol from "../data/AdminCol";

function OnSubmitNewSection(
  event: React.FormEvent<HTMLFormElement>,
  closeAddSec: () => void,
  strand: string,
  section: string,
  current: CurrentSections,
  handleOpenAlert: (severity: string, message: string) => void
) {
  event.preventDefault();
  if (section.length > 0 && section.length < 51) {
    const onAddedSection = (success: boolean, message: string) => {
      if (success) {
        handleOpenAlert("success", message);
      } else {
        handleOpenAlert("error", message);
      }
      closeAddSec();
    };

    AdminCol.AddSection(current, strand, section, onAddedSection);
  }
}

interface AddSectionProps {
  CloseAddSec: () => void;
  IsOpen: boolean;
  Strand: string;
  CurrentSections: CurrentSections;
  HandleOpenAlert: (severity: string, message: string) => void;
}
export default function AddSection(props: AddSectionProps) {
  const [section, setSection] = useState<string>("");
  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSection(value);
  };

  return (
    <Dialog
      open={props.IsOpen}
      onClose={props.CloseAddSec}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
          OnSubmitNewSection(
            event,
            props.CloseAddSec,
            props.Strand,
            section,
            props.CurrentSections,
            props.HandleOpenAlert
          );
        },
      }}
    >
      <DialogTitle>New Section</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          required
          margin="dense"
          name="section"
          label="New Section"
          fullWidth
          variant="standard"
          onChange={onChangeInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.CloseAddSec} color="error">
          Cancel
        </Button>
        <Button type="submit">Add</Button>
      </DialogActions>
    </Dialog>
  );
}
