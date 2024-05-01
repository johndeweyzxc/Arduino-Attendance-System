import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { ChangeEvent, useEffect, useState } from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import StudentDB from "../data/StudentDB";
import {
  StudentData,
  UniqueRowStudentData,
  UniqueStudentData,
} from "../models/Models";
import { Timestamp } from "firebase/firestore";
import Notification from "../components/Notification";

function StudentHeader() {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#c43835", witdh: "100vw" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", margin: ".5rem" }}>
        <Tooltip title="Home">
          <IconButton
            size="large"
            color="inherit"
            onClick={() => (window.location.href = "/")}
          >
            <ArrowBackIcon />
          </IconButton>
        </Tooltip>
        <Typography variant="h6">Student</Typography>
      </Box>
    </AppBar>
  );
}

function OnSubmitUpdate(
  event: React.FormEvent<HTMLFormElement>,
  studentData: StudentData,
  setInputErrorIndicator: React.Dispatch<
    React.SetStateAction<InputErrorIndicator>
  >,
  inputErrorIndicator: InputErrorIndicator,
  handleOpenAlert: (severity: string, message: string) => void,
  handleCloseAlert: () => void
) {
  event.preventDefault();
  let errorIndicator = {
    ...inputErrorIndicator,
  };

  setInputErrorIndicator({
    StudentName: "",
    Section: "",
    GradeLevel: "",
    Strand: "",
    RFIDCode: "",
  });

  const isValidRFID = (): boolean => {
    const isHex = /^[0-9A-Fa-f]+$/g.test(studentData.RFIDCode);
    if (
      !isHex ||
      studentData.RFIDCode.length > 8 ||
      studentData.RFIDCode.length < 8
    ) {
      return false;
    }
    return true;
  };

  if (studentData.StudentName.length === 0) {
    errorIndicator.StudentName = "Student name cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (studentData.GradeLevel === 0) {
    errorIndicator.GradeLevel = "Grade level cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (studentData.Strand === "") {
    errorIndicator.Strand = "Strand cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (studentData.Section === "") {
    errorIndicator.Section = "Section cannot be empty";
    setInputErrorIndicator(errorIndicator);
  } else if (!isValidRFID()) {
    errorIndicator.RFIDCode = "Invalid RFID code";
    setInputErrorIndicator(errorIndicator);
  } else {
    // Input validated, send data to server
    console.log(`Student.OnSubmitUpdate: Updating student data`);
    const data: UniqueRowStudentData = {
      ...(studentData as UniqueRowStudentData),
    };

    const OnUpdatedStudent = (isSuccess: boolean) => {
      if (isSuccess) {
        handleOpenAlert("success", "Successfully updated student");
      } else {
        handleOpenAlert("error", "Failed to update student");
      }
      handleCloseAlert();
    };

    StudentDB.UpdateStudent(data, data.id, OnUpdatedStudent);
  }
}

function OnDeleteStudent(
  studentData: StudentData,
  handleOpenAlert: (severity: string, message: string) => void,
  handleCloseAlert: () => void
) {
  const data: UniqueRowStudentData = {
    ...(studentData as UniqueRowStudentData),
  };

  const OnDeletedStudent = (isSuccess: boolean) => {
    if (isSuccess) {
      handleOpenAlert("success", "Successfully deleted student");
    } else {
      handleOpenAlert("error", "Failed to delete student");
    }
    handleCloseAlert();
  };

  StudentDB.DeleteStudent(data.id, OnDeletedStudent);
}

interface InputErrorIndicator {
  StudentName: string;
  Section: string;
  GradeLevel: string;
  Strand: string;
  RFIDCode: string;
}

interface StudentDialogParams {
  IsOpen: boolean;
  HandleClose: () => void;
  SelectedRow: UniqueStudentData;
  SetSelectedRow: React.Dispatch<React.SetStateAction<UniqueStudentData>>;
  HandleOpenAlert: (severity: string, message: string) => void;
}
function StudentDialog(props: StudentDialogParams) {
  const [inputErrorIndicator, setInputErrorIndicator] =
    useState<InputErrorIndicator>({
      StudentName: "",
      Section: "",
      GradeLevel: "",
      Strand: "",
      RFIDCode: "",
    });

  const onChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    props.SetSelectedRow({ ...props.SelectedRow, [name]: value });
  };

  return (
    <Dialog
      open={props.IsOpen}
      onClose={props.HandleClose}
      PaperProps={{
        component: "form",
        onSubmit: (event: React.FormEvent<HTMLFormElement>) =>
          OnSubmitUpdate(
            event,
            props.SelectedRow,
            setInputErrorIndicator,
            inputErrorIndicator,
            props.HandleOpenAlert,
            props.HandleClose
          ),
      }}
    >
      <DialogTitle>Update Student Data</DialogTitle>
      <DialogContent>
        <TextField
          helperText={inputErrorIndicator.StudentName}
          margin="dense"
          name="StudentName"
          label="Student Name"
          variant="standard"
          value={props.SelectedRow.StudentName}
          fullWidth
          onChange={onChangeInput}
        />
        <TextField
          helperText={inputErrorIndicator.Section}
          margin="dense"
          name="Section"
          label="Section"
          variant="standard"
          value={props.SelectedRow.Section}
          fullWidth
          onChange={onChangeInput}
        />
        <TextField
          helperText={inputErrorIndicator.GradeLevel}
          margin="dense"
          name="GradeLevel"
          label="Grade Level"
          variant="standard"
          value={props.SelectedRow.GradeLevel}
          fullWidth
          select
          onChange={onChangeInput}
        >
          <MenuItem key={"Item 11"} value={11}>
            11
          </MenuItem>
          <MenuItem key={"Item 12"} value={12}>
            12
          </MenuItem>
        </TextField>
        <TextField
          helperText={inputErrorIndicator.Strand}
          margin="dense"
          name="Strand"
          label="Strand"
          variant="standard"
          value={props.SelectedRow.Strand}
          fullWidth
          select
          onChange={onChangeInput}
        >
          <MenuItem key={"Item STEM"} value="STEM">
            STEM
          </MenuItem>
          <MenuItem key={"Item ABM"} value="ABM">
            ABM
          </MenuItem>
          <MenuItem key={"Item HUMSS"} value="HUMSS">
            HUMSS
          </MenuItem>
          <MenuItem key={"Item TVL"} value="TVL">
            TVL
          </MenuItem>
        </TextField>
        <TextField
          helperText={inputErrorIndicator.RFIDCode}
          margin="dense"
          name="RFIDCode"
          label="RFID Code"
          variant="standard"
          value={props.SelectedRow.RFIDCode}
          fullWidth
          onChange={onChangeInput}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.HandleClose}>Cancel</Button>
        <Button
          onClick={() =>
            OnDeleteStudent(
              props.SelectedRow,
              props.HandleOpenAlert,
              props.HandleClose
            )
          }
          color="error"
        >
          Delete
        </Button>
        <Button type="submit">Update</Button>
      </DialogActions>
    </Dialog>
  );
}

interface StudentTableProps {
  HandleOpenAlert: (severity: string, message: string) => void;
}
function StudentTable(props: StudentTableProps) {
  const columns: GridColDef<(typeof students)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "StudentName",
      headerName: "Student Name",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Section",
      headerName: "Section",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "GradeLevel",
      headerName: "Grade Level",
      type: "number",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "Strand",
      headerName: "Strand",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "RFIDCode",
      headerName: "RFID Code",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
  ];

  const [students, setStudents] = useState<Object[]>([]);

  useEffect(() => {
    const onReceivedStudent = (students: Object[] | null) => {
      if (students === null) {
        props.HandleOpenAlert("error", "Failed to fetch student data");
        return;
      }

      setStudents(students);
    };
    const unsubscribe = StudentDB.ListenStudent(onReceivedStudent);

    return () => {
      // Cleanup listener when the component unmounts
      unsubscribe();
    };
  }, [props]);

  const [isOpen, setIsOpen] = useState<boolean>(false); // Dialog
  const [selectedRow, setSelectedRow] = useState<UniqueStudentData>({
    StudentId: "",
    StudentName: "",
    Section: "",
    GradeLevel: 11,
    Strand: "",
    RFIDCode: "",
    AccountCreatedAt: Timestamp.fromDate(new Date()).toDate(),
  });
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setSelectedRow(params.row);
    setIsOpen(true);
  };
  const handleCloseDialog = () => setIsOpen(false);

  return (
    <>
      <Typography variant="h5" sx={{ margin: "1rem" }}>
        Student Data
      </Typography>
      <Box
        sx={{
          height: 500,
          width: "100%",
          marginRight: "1rem",
          marginLeft: "1rem",
          marginBottom: "1rem",
        }}
      >
        <DataGrid
          onRowClick={handleRowClick}
          rows={students}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          pageSizeOptions={[10]}
        />
      </Box>
      <StudentDialog
        IsOpen={isOpen}
        HandleClose={handleCloseDialog}
        SelectedRow={selectedRow}
        SetSelectedRow={setSelectedRow}
        HandleOpenAlert={props.HandleOpenAlert}
      />
    </>
  );
}

export function Student() {
  const notify = Notification();

  return (
    <>
      <StudentHeader />
      <StudentTable HandleOpenAlert={notify.HandleOpenAlert} />
      {notify.SnackBar}
    </>
  );
}
