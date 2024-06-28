import { Box, InputAdornment, TextField } from "@mui/material";
import { DataGrid, GridColDef, GridEventListener } from "@mui/x-data-grid";
import { MONTHS } from "./Attendance/MonthsStack";
import { useEffect, useState } from "react";
import StudentCol from "../data/StudentCol";
import SearchIcon from "@mui/icons-material/Search";
import { UniqueRowStudentData } from "../models/Models";

export const STUDENTS = "STUDENTS";

interface StudentTableParams {
  SelectedStackVal: string[];
  PushStack: (stackName: string, stackValue: string | Object) => void;
}
export function StudentTable(props: StudentTableParams) {
  const section = props.SelectedStackVal[0];
  const strand = props.SelectedStackVal[1];
  const gradeLevel = parseInt(props.SelectedStackVal[2]);

  const columns: GridColDef<(typeof studentList)[number]>[] = [
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
      headerName: "Name",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "GradeLevel",
      headerName: "Grade Level",
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
      field: "Section",
      headerName: "Section",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
    {
      field: "RFIDCode",
      headerName: "RFID",
      minWidth: 200,
      editable: false,
      flex: 1,
      resizable: false,
    },
  ];

  const [studentList, setStudentList] = useState<Object[]>([]);
  const [studentFiltered, setStudentFiltered] = useState<Object[]>([]);
  const onReceivedStudents = (students: Object[] | null) => {
    if (students !== null) {
      setStudentList(students);
      setStudentFiltered(students);
    }
  };
  useEffect(() => {
    const unsubscribe = StudentCol.ListenStudent(
      gradeLevel,
      strand,
      section,
      onReceivedStudents
    );

    return () => {
      // Clean up when this component unmounts
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRowClick: GridEventListener<"rowClick"> = (params) => {
    // * Current stack: ["STUDENTS", "SECTIONS", "STRANDS", "GRADE LEVELS"]
    props.PushStack(MONTHS, params.row);
    // * Expected stack: ["MONTHS", "STUDENTS", "SECTIONS", "STRANDS", "GRADE LEVELS"]
  };

  const onSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm.length === 0) {
      setStudentFiltered(studentList);
      return;
    }
    const filteredStudents = studentList.filter((student) => {
      const studentData = student as UniqueRowStudentData;
      return studentData.StudentName.toLowerCase().includes(
        searchTerm.toLowerCase()
      );
    });
    setStudentFiltered(filteredStudents);
  };

  return (
    <div className="w-[95%] flex flex-col justify-center m-4">
      <TextField
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ marginBottom: "1rem" }}
        label="Search Student"
        variant="outlined"
        onChange={onSearchInput}
      />
      <Box
        sx={{
          height: 500,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <DataGrid
          onRowClick={handleRowClick}
          rows={studentFiltered}
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
  );
}
