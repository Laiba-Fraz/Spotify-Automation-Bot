import Tasks from "../Tasks";

function Running() {
  return <Tasks  URL="https://server.appilot.app/get-running-tasks"/>;
  // return <Tasks  URL="http://127.0.0.1:8000/get-running-tasks"/>;
}

export default Running;
