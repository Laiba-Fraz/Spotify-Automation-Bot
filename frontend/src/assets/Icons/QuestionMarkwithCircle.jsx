function QuestionMarkwithCircle(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      fill="none"
      aria-hidden="true"
      onClick={props.handler}
      id="infoIcon"
    >
      <g fill="currentColor">
        <path d="M6.75 8.438C6.75 6.725 8.303 5.5 10 5.5s3.25 1.225 3.25 2.938c0 1.456-1.122 2.559-2.501 2.857a.75.75 0 0 1-1.499-.045v-.625a.75.75 0 0 1 .75-.75c1.063 0 1.75-.735 1.75-1.437S11.063 7 10 7s-1.75.735-1.75 1.438v.312a.75.75 0 0 1-1.5 0zM10 15a.937.937 0 1 0 0-1.875A.937.937 0 0 0 10 15"></path>
        <path
          fill-rule="evenodd"
          d="M10 1.75a8.25 8.25 0 1 0 0 16.5 8.25 8.25 0 0 0 0-16.5M3.25 10a6.75 6.75 0 1 1 13.5 0 6.75 6.75 0 0 1-13.5 0"
          clip-rule="evenodd"
        ></path>
      </g>
    </svg>
  );
}

export default QuestionMarkwithCircle;
