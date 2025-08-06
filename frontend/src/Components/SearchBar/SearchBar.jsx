import { useEffect, useState } from "react";
import classes from "./SearchBar.module.css";
import SearchIcon from "../../assets/Icons/SearchIcon";

function SearchBar(props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const searchBar = document.querySelector(`.${classes.searchBar}`);
    const searchbarForm = document.querySelector(`.${classes.searchbarform}`);

    if (searchBar && searchbarForm) {
      searchBar.addEventListener("focus", () => {
        searchbarForm.style.boxShadow = "rgb(179, 199, 255) 0px 0px 0px 2px";
        searchbarForm.style.borderColor = "#1672eb";
      });

      searchBar.addEventListener("blur", () => {
        searchbarForm.style.boxShadow =
          "4px 8px 10.1px -2.5px rgba(63, 71, 93, 0.12), 1.7px 3.3px 4.2px -1.7px rgba(63, 71, 93, 0.13), 0.7px 1.4px 1.8px -0.8px rgba(63, 71, 93, 0.14), 0.3px 0.5px 0.7px 0px rgba(63, 71, 93, 0.15)";
        searchbarForm.style.borderColor = "#d0d5e9";
      });
    }

    return () => {
      searchBar?.removeEventListener("focus", () => {});
      searchBar?.removeEventListener("blur", () => {});
    };
  }, []);

  function searchHandler(event) {
    setValue(event.target.value);
    props.searchHandler(event.target.value);
  }

  return (
    <div className={classes.inputContainer}>
      <div className={classes.searchbarform}>
        <input
          type="text"
          className={classes.searchBar}
          placeholder="Search for Bots"
          onChange={searchHandler}
          value={value}
        />
        <button className={classes.Searchbtn} onClick={searchHandler}>
          <SearchIcon />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
