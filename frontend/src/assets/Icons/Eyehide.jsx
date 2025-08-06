function Eyehide(props) {
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
        d="M3.37 2.164a.5.5 0 1 0-.74.672L3.832 4.16C1.562 5.553.586 7.7.543 7.798a.5.5 0 0 0 0 .406c.022.05.551 1.223 1.728 2.4C3.84 12.17 5.82 13 8 13a7.94 7.94 0 0 0 3.254-.677l1.375 1.513a.499.499 0 1 0 .74-.672zm5.562 7.605a2 2 0 0 1-2.604-2.865zm6.525-1.565c-.026.059-.66 1.46-2.085 2.737a.5.5 0 0 1-.704-.035l-6.33-6.964a.5.5 0 0 1 .287-.83A8.4 8.4 0 0 1 8 3c2.18 0 4.16.829 5.729 2.397 1.177 1.177 1.706 2.351 1.728 2.4a.5.5 0 0 1 0 .407"
      ></path>
    </svg>
  );
}

export default Eyehide;
