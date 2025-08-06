import classes from "./Dropdown.module.css";

function Dropdown(props) {
  const handleDropdownClick = (event) => {
    event.preventDefault();
    event.stopPropagation();  
    if (props.handler) {
      props.handler();  
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="auto"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${classes.svg} ${props.direction ? classes.upsvg : ""}`}
      onClick={handleDropdownClick}  
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default Dropdown;
