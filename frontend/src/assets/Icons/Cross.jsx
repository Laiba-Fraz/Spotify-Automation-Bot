function Cross(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
      className="Toast-Icon"
      color={props.color}
    >
      <path
        fill="currentColor"
        fill-rule="evenodd"
        d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0M5.707 4.293a1 1 0 0 0-1.414 1.414L6.586 8l-2.293 2.293a1 1 0 1 0 1.414 1.414L8 9.414l2.293 2.293a1 1 0 1 0 1.414-1.414L9.414 8l2.293-2.293a1 1 0 0 0-1.414-1.414L8 6.586z"
        clip-rule="evenodd"
      ></path>
    </svg>
  );
}

export default Cross;
