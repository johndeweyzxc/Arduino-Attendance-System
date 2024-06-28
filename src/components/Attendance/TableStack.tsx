import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import {
  UniqueAttendanceData,
  UniqueRowAttendanceData,
  UniqueRowStudentData,
} from "../../models/Models";
import { Timestamp } from "firebase/firestore";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AttCol from "../../data/AttCol";

export const ATTENDANCES = "ATTENDANCES";

function OnDeleteAttendance(
  attendanceData: UniqueRowAttendanceData,
  handleOpenAlert: (severity: string, message: string) => void,
  handleCloseAlert: () => void,
  studentId: string
) {
  const OnDeletedAttendance = (success: boolean) => {
    if (success) {
      handleOpenAlert("success", "Successfully deleted student");
    } else {
      handleOpenAlert("error", "Failed to delete student");
    }
    handleCloseAlert();
  };

  AttCol.DelAtt(studentId, attendanceData.id, OnDeletedAttendance);
}

interface AttendanceDialogProps {
  IsOpen: boolean;
  HandleOpenAlert: (severity: string, message: string) => void;
  HandleClose: () => void;
  AttendanceData: UniqueRowAttendanceData;
  StudentId: string;
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
          {props.AttendanceData.id} from student with id {props.StudentId}, this
          action is irreversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.HandleClose}>Cancel</Button>
        <Button
          onClick={() =>
            OnDeleteAttendance(
              props.AttendanceData,
              props.HandleOpenAlert,
              props.HandleClose,
              props.StudentId
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

interface AttendanceTableParams {
  HandleOpenAlert: (severity: string, message: string) => void;
  SelectedStackVal: any[];
}
export function TableStack(props: AttendanceTableParams) {
  const month = props.SelectedStackVal[0];
  const student = props.SelectedStackVal[1] as UniqueRowStudentData;

  const [attendanceData, setAttendanceData] = useState<Object[]>([]);
  const onReceivedAttendanceData = (attendances: Object[] | null) => {
    if (attendances === null) {
      return;
    }
    const attendanceData = attendances as UniqueAttendanceData[];
    const uniqueRowAttendanceData: Object[] = [];

    attendanceData.forEach((attendance) => {
      const row: UniqueRowAttendanceData = {
        id: attendance.AttendanceId,
        TimeInStr: FormatTimeStamp(attendance.TimeIn),
      };
      uniqueRowAttendanceData.push(row);
    });

    setAttendanceData(uniqueRowAttendanceData);
  };

  useEffect(() => {
    const unsubscribe = AttCol.ListenAtt(
      student.id,
      student.StudentName,
      month,
      onReceivedAttendanceData
    );

    return () => {
      // Clean up when this component unmounts
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns: GridColDef<(typeof attendanceData)[number]>[] = [
    {
      field: "id",
      headerName: "ID",
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

  const [isOpen, setIsOpen] = useState<boolean>(false); // Dialog
  const [selectedRow, setSelectedRow] = useState<UniqueRowAttendanceData>({
    id: "",
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
        <Box
          sx={{
            height: 500,
            width: "100%",
            alignSelf: "center",
          }}
        >
          <DataGrid
            onRowClick={handleRowClick}
            rows={attendanceData}
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
        StudentId={student.id}
      />
    </>
  );
}
