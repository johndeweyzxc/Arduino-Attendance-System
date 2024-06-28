import { useState } from "react";
import { LevelStack, GRADE_LEVELS } from "../components/Attendance/LevelStack";
import { StrandStack, STRANDS } from "../components/Attendance/StrandStack";
import { SectionStack, SECTIONS } from "../components/Attendance/SectionStack";
import { StudentTable, STUDENTS } from "../components/StudentTable";
import { MonthsStack, MONTHS } from "../components/Attendance/MonthsStack";
import { TableStack, ATTENDANCES } from "../components/Attendance/TableStack";
import Notification from "../components/Notification";
import Header from "../components/Attendance/Header";
import Background from "../assets/images/school-photo.jpg";

export function Attendance() {
  const notify = Notification();
  const [sectionList, setSectionList] = useState<string[]>([]);
  const appendSectionList = (list: string[]) => setSectionList(list);

  const [selectedStack, setSelectedStack] = useState<string[]>([GRADE_LEVELS]);
  const [selectedStackVal, setSelectedVal] = useState<any[]>([]);
  const pushStack = (stackName: string, stackValue: string | Object) => {
    // PUSH ITEM ONTO THE TOP OF THE STACK
    setSelectedStack((curr) => [stackName, ...curr]);
    setSelectedVal((curr) => [stackValue, ...curr]);
  };
  const popStack = () => {
    // POP ITEM FROM TOP OF THE STACK
    const poppingLogic = (prevStack: string[]) => {
      if (prevStack[0] === GRADE_LEVELS) return prevStack;
      const newStack = [...prevStack];
      newStack.shift();
      return newStack;
    };
    setSelectedStack((prevStack) => poppingLogic(prevStack));
    setSelectedVal((prevStack) => poppingLogic(prevStack));
  };

  console.log("STACK: ", selectedStack);

  let componentToRender = <LevelStack PushStack={pushStack} />;
  if (selectedStack[0] === GRADE_LEVELS) {
    componentToRender = <LevelStack PushStack={pushStack} />;
  } else if (selectedStack[0] === STRANDS) {
    componentToRender = (
      <StrandStack
        AppendSectionList={appendSectionList}
        PushStack={pushStack}
      />
    );
  } else if (selectedStack[0] === SECTIONS) {
    componentToRender = (
      <SectionStack
        SectionList={sectionList}
        PushStack={pushStack}
        HandleOpenAlert={notify.HandleOpenAlert}
        SelectedStackVal={selectedStackVal}
      />
    );
  } else if (selectedStack[0] === STUDENTS) {
    componentToRender = (
      <StudentTable SelectedStackVal={selectedStackVal} PushStack={pushStack} />
    );
  } else if (selectedStack[0] === MONTHS) {
    componentToRender = <MonthsStack PushStack={pushStack} />;
  } else if (selectedStack[0] === ATTENDANCES) {
    componentToRender = (
      <TableStack
        SelectedStackVal={selectedStackVal}
        HandleOpenAlert={notify.HandleOpenAlert}
      />
    );
  }

  // * Check if the component to render is a table or not
  const listBasedComponent = (
    <div className="flex flex-col justify-center items-center w-[40%] max-md:w-[70%] max-sm:w-[90%]">
      {componentToRender}
    </div>
  );
  const tableBasedComponent = (
    <div className="flex flex-col justify-center items-center w-full">
      {componentToRender}
    </div>
  );
  let finalComponentToRender = listBasedComponent;
  if (selectedStack[0] === STUDENTS) {
    finalComponentToRender = tableBasedComponent;
  } else if (selectedStack[0] === ATTENDANCES) {
    finalComponentToRender = tableBasedComponent;
  } else if (selectedStack[0] === MONTHS) {
    // Month selection is not a table but we use table based to occupy whole width space
    finalComponentToRender = tableBasedComponent;
  } else {
    finalComponentToRender = listBasedComponent;
  }

  return (
    <>
      <Header SelectedStack={selectedStack} PopStack={popStack} />
      {selectedStack[0] === STUDENTS ||
      selectedStack[0] === ATTENDANCES ? null : (
        <>
          <img
            alt="Montesorri school building"
            src={Background}
            className="z-[-1] absolute w-full h-full object-cover"
          />
          <div className="absolute w-screen h-full z-[-1] bg-black/50" />
        </>
      )}

      <div className="h-screen flex flex-col justify-center items-center ">
        {finalComponentToRender}
      </div>
      {notify.SnackBar}
      <div className="w-screen py-4 px-8 flex justify-end border-t-2 border-solid border-[#c43835]">
        <p>A. Soriano Highway, Timalan, Naic, Cavite, Philippines</p>
      </div>
    </>
  );
}
