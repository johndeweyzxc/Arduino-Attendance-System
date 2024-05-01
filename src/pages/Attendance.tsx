import {
  AppBar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useEffect, useState } from "react";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import StudentDB from "../data/StudentDB";
import { UniqueStudentAttendanceData } from "../models/Models";
import { Timestamp } from "firebase/firestore";
import Notification from "../components/Notification";

function AttendanceHeader() {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#c43835", width: "100vw" }}
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
        <Typography variant="h6">Attendance</Typography>
      </Box>
    </AppBar>
  );
}

function FormatTimeStamp(timestamp: Timestamp) {
  const dt = timestamp.toDate();
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long", // Get full month name
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "long", // Get full day name
  };
  const dateFormatter = new Intl.DateTimeFormat("en-US", options);
  const formattedDate = dateFormatter.format(dt);
  return formattedDate;
}

function OnDeleteAttendance(
  attendanceData: UniqueStudentAttendanceData,
  handleOpenAlert: (severity: string, message: string) => void,
  handleCloseAlert: () => void
) {
  const OnDeletedAttendance = (isSuccess: boolean) => {
    if (isSuccess) {
      handleOpenAlert("success", "Successfully deleted student");
      window.location.href = "/";
    } else {
      handleOpenAlert("error", "Failed to delete student");
    }
    handleCloseAlert();
  };

  StudentDB.DeleteAttendance(
    attendanceData.StudentId,
    attendanceData.AttendanceId,
    OnDeletedAttendance
  );
}

interface AttendanceDialogProps {
  IsOpen: boolean;
  HandleOpenAlert: (severity: string, message: string) => void;
  HandleClose: () => void;
  AttendanceData: UniqueStudentAttendanceData;
}
function AttendanceDialog(props: AttendanceDialogProps) {
  return (
    <Dialog open={props.IsOpen} onClose={props.HandleClose}>
      <DialogTitle id="alert-dialog-title">
        {"Delete attendance record?"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Do you wish to delete the attendance record with id{" "}
          {props.AttendanceData.AttendanceId} from student with id{" "}
          {props.AttendanceData.StudentId}, this action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.HandleClose}>Cancel</Button>
        <Button
          onClick={() =>
            OnDeleteAttendance(
              props.AttendanceData,
              props.HandleOpenAlert,
              props.HandleClose
            )
          }
          color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface AttendanceTableProps {
  HandleOpenAlert: (severity: string, message: string) => void;
}
function AttendanceTable(props: AttendanceTableProps) {
  const columns: GridColDef<(typeof attendance)[number]>[] = [
    {
      field: "AttendanceId",
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
      field: "TimeInStr",
      headerName: "Time in",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
  ];

  // attendance contains the object of type UniqueStudentAttendanceData
  const [attendance, setAttendance] = useState<Object[]>([]);

  useEffect(() => {
    const onReceivedStudentAttendance = (
      student: UniqueStudentAttendanceData | null
    ) => {
      if (student === null) {
        // Notify user that fetching of attendance data has failed
        props.HandleOpenAlert(
          "error",
          "Failed to fetch student attendance data"
        );
        return;
      }

      student.TimeInStr = FormatTimeStamp(student.TimeIn);
      const studentObject: Object = {
        ...student,
      };
      setAttendance((prevAttendance) => [...prevAttendance, studentObject]);
    };

    StudentDB.GetStudentAttendance(onReceivedStudentAttendance);
  }, [props]);

  const [isOpen, setIsOpen] = useState<boolean>(false); // Dialog
  const [selectedRow, setSelectedRow] = useState<UniqueStudentAttendanceData>({
    StudentId: "",
    StudentName: "",
    Section: "",
    GradeLevel: 11,
    Strand: "",
    RFIDCode: "",
    AccountCreatedAt: Timestamp.fromDate(new Date()).toDate(),

    id: "",
    AttendanceId: "",
    TimeIn: new Timestamp(0, 0),
    TimeInStr: "",
  });
  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    setSelectedRow(params.row);
    setIsOpen(true);
  };
  const handleCloseDialog = () => setIsOpen(false);

  return (
    <>
      <div className="w-[95%] flex flex-col justify-center m-4">
        <Typography variant="h5" sx={{ width: "100%", marginBottom: "1rem" }}>
          Attendance Data
        </Typography>
        <Box
          sx={{
            height: 500,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <DataGrid
            onRowClick={handleRowClick}
            rows={attendance}
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
      </div>
      <AttendanceDialog
        IsOpen={isOpen}
        HandleOpenAlert={props.HandleOpenAlert}
        HandleClose={handleCloseDialog}
        AttendanceData={selectedRow}
      />
    </>
  );
}

export function Attendance() {
  const notify = Notification();

  return (
    <>
      <AttendanceHeader />
      <AttendanceTable HandleOpenAlert={notify.HandleOpenAlert} />
      {notify.SnackBar}
    </>
  );
}
