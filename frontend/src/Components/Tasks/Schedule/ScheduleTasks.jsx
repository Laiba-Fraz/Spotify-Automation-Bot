import React from "react";
import Tasks from "../Tasks";

function ScheduleTasks() {
  return <Tasks URL="https://server.appilot.app/get-scheduled-tasks"/>;
  // return <Tasks URL="http://127.0.0.1:8000/get-scheduled-tasks"/>;
}

export default ScheduleTasks;
