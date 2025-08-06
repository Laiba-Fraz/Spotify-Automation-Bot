import classes from "./Tables.module.css";
import P14G from "../Paragraphs/P14G";
import { useState, useEffect } from "react";
import Dropdown from "./../../assets/Icons/Dropdown";
import TableSearchBar from "../SearchBar/TableSearchBar";
import P1420600 from "../Paragraphs/P1420600";
import CompleteOverlay from "../Overlay/CompleteOverlay";
import H20 from "../Headings/H20";
import GreyButton from "../Buttons/GreyButton";
import RedButton from "../Buttons/RedButton";
import DeleteConfirm from "../Form/DeleteConfirm/DeleteConfirm";

function Tables(props) {
  const [Pagenomenu, setPagenoMenu] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmHandler, setConfirmHandler] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [confirmBtnMessage, setConfirmBtnMessage] = useState(null);
  const showPagenoMenu = () => {
    setPagenoMenu((preState) => !preState);
  };

  useEffect(() => {
    const tooltipdiv = document.getElementById("noOfPages");
    const infoIcon = document.getElementById("noOfPagesbtn");

    function tooltiphandler(event) {
      if (
        (tooltipdiv && tooltipdiv.contains(event.target)) ||
        (infoIcon && infoIcon.contains(event.target))
      ) {
        return;
      }

      setPagenoMenu(false);
    }

    window.addEventListener("mousedown", tooltiphandler);

    return () => {
      window.removeEventListener("mousedown", tooltiphandler);
    };
  }, [Pagenomenu]);

  const changeNoPageHandler = (event) => {
    props.chageNoofPgaes(event.target.textContent);
  };

  const searchHandler = (value) => {
    props.searchHandler(value);
  };

  const uncheckAll = () => {
    props.cancelAllSelectedHandler();
  };

  const NextHandler = () => {
    props.nextHandler();
  };

  const prevHandler = () => {
    props.prevHandler();
  };

  const showConfirmationHandler = (
    handler,
    confirmationMessage,
    confirmBtnMessage
  ) => {
    setConfirmHandler(() => handler);
    setConfirmMessage(confirmationMessage);
    setConfirmBtnMessage(confirmBtnMessage);
    setShowConfirmation(true);
  };
  const hideConfirmationHandler = () => {
    setConfirmHandler(null);
    setShowConfirmation(false);
  };

  const deleteHnadler = () => {
    setShowConfirmation(false);
    confirmHandler();
    // props.deleteHandler();
  };

  return (
    <>
      <div className={classes.main}>
        <div className={classes.searchbarMain}>
          <TableSearchBar
            handler={searchHandler}
            placeholder={props.searchbarPlaceHolder}
          />
          <P1420600>
            {props.noOfBots} {props.type}
          </P1420600>
          <div className={classes.options}>
            <P14G>{props.selected.length} selected</P14G>
            {/* {
              props.selected.length > 0 ? (
                // ? props.buttons.map((btn) => {
                //     return (
                <button onClick={showConfirmationHandler}>Delete</button>
              ) : (
                //   );
                // })
                // : props.buttons.map((btn) => {
                //     return (
                <button className={classes.DisabledButton}>Delete</button>
              )
              //   );
              // })
            } */}
            {props.selected.length > 0 && props.buttons.length > 0
              ? props.buttons.map((btn) => {
                  return (
                    <button
                      onClick={() => {
                        if (btn.type === "confirm") {
                          showConfirmationHandler(
                            btn.handler,
                            btn.confirmationMessage,
                            btn.confirmBtnMessage
                          );
                          return;
                        }
                        btn.handler();
                      }}
                    >
                      {btn.btnName}
                    </button>
                  );
                })
              : props.buttons.map((btn) => {
                  return (
                    <button className={classes.DisabledButton}>
                      {btn.btnName}
                    </button>
                  );
                })}
          </div>
        </div>
        <table className={classes.table}>{props.children}</table>
        <div className={classes.Tablefooter}>
          <div className={classes.pagesSelection}>
            <P14G>Items per page:</P14G>
            <div
              className={classes.pagesNoBtn}
              onClick={showPagenoMenu}
              id="noOfPagesbtn"
            >
              {props.noOfItemInTable}{" "}
              <Dropdown direction={Pagenomenu} handler={showPagenoMenu} />{" "}
              {Pagenomenu && (
                <div className={classes.pagemenucont} id="noOfPages">
                  <button onClick={changeNoPageHandler}>10</button>
                  <button onClick={changeNoPageHandler}>20</button>
                  <button onClick={changeNoPageHandler}>50</button>
                  <button onClick={changeNoPageHandler}>100</button>
                  <button onClick={changeNoPageHandler}>200</button>
                  <button onClick={changeNoPageHandler}>All</button>
                </div>
              )}
            </div>
          </div>
          <div className={classes.pageNvigationcont}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-left"
              className={
                props.currentPage === 1
                  ? `${classes.disable} ${classes.navigator}`
                  : `${classes.navigator}`
              }
              onClick={props.currentPage !== 1 ? prevHandler : undefined}
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <div className={classes.pageno}>{props.currentPage}</div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-chevron-right"
              className={
                props.nextBtn
                  ? ` ${classes.navigator}`
                  : `${classes.navigator} ${classes.disable}`
              }
              onClick={props.nextBtn ? NextHandler : undefined}
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
        </div>
      </div>
      {showConfirmation && (
        <CompleteOverlay>
          <DeleteConfirm
            // message={`Are you sure you want to delete sectected ${props.type}?`}
            message={`${confirmMessage}`}
            btnMessage={`${confirmBtnMessage}`}
            hideFormHandler={hideConfirmationHandler}
            deleteConfirmHandler={deleteHnadler}
            // deleteConfirmHandler={confirmHandler}
            formShowState={showConfirmation}
          />
        </CompleteOverlay>
      )}
    </>
  );
}

export default Tables;
