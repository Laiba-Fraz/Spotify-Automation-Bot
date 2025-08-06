function Eyeshow(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="none"
      aria-hidden="true"
      onClick={props.PasswordShowHandler}
    >
      <path
        fill="currentColor"
        d="M15.457 7.798c-.022-.05-.551-1.224-1.728-2.401C12.16 3.829 10.18 3 8 3s-4.16.829-5.729 2.397C1.094 6.574.562 7.75.543 7.797a.5.5 0 0 0 0 .407c.022.05.551 1.223 1.728 2.4C3.84 12.17 5.82 13 8 13s4.16-.829 5.729-2.396c1.177-1.177 1.706-2.35 1.728-2.4a.5.5 0 0 0 0-.407M8 10.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5"
      ></path>
    </svg>
  );
}

export default Eyeshow;
