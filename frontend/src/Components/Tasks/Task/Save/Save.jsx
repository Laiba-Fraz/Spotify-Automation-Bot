import React from "react";
import classes from "./Save.module.css";
import GreyButton from "../../../Buttons/GreyButton";
import H24 from "../../../Headings/H24";
import Cut from "../../../../assets/Icons/Cut";
import Tick from "../../../../assets/Icons/Tick";
import DisabledButton from "../../../Buttons/DisabledButton";
import { OptionDisplay, renderInputDetails, renderSchedule, ScheduleSection } from "../../../../Utils/utils";


function Save({ task, saveHandler, devicesNavigator, disabled }) {


  const renderInput = (el) => {
    switch (el.type.toLowerCase()) {
      case "toggle":
      case "togglewithkeywords":
      case "toggleurlandkeyword":
      case "togglekeywordsandgap":
      case "toggleandgap":
      case "toggleandunfollowinputs":
        return el.input ? <Tick class="greenCheck" /> : <Cut class="redCut" />;
      default:
        return String(el.input);
    }
  };

  const showDevicesHandler = () => {
    devicesNavigator("Choose device");
  };


  // return (
  //   <div className={classes.main}>
  //     <div className={classes.inputsContainer}>
  //       <H24>Inputs</H24>
  //       {task.inputs.inputs.map((section, index) => (
  //         <ScheduleSection key={index} title={section.name}>
  //           {section.inputs.map((input, inputIndex) => {
  //             if (input.type === "instagrmFollowerBotAcountWise") {
  //               return (
  //                 input.Accounts.map((account, accIndex) => {
  //                   return (
  //                     account.inputs.map((accinput, accountinputindex) => {
  //                       return (
  //                         <>
  //                           <OptionDisplay
  //                             key={accountinputindex}
  //                             name={accinput.name}
  //                             value={renderInput(accinput)}
  //                             el={accinput}
  //                           />
  //                           {renderInputDetails(accinput)}
  //                         </>
  //                       );
  //                     })
  //                   )
  //                 })
  //               );
  //             }
  //             return (
  //               <>
  //                 <OptionDisplay
  //                   key={inputIndex}
  //                   name={input.name}
  //                   value={renderInput(input)}
  //                   el={input}
  //                 />
  //                 {renderInputDetails(input)}
  //               </>
  //             );
  //           })}
  //         </ScheduleSection>
  //       ))}
  //     </div>
  //     <div className={classes.inputsContainer}>
  //       <H24>Schedule</H24>
  //       {renderSchedule(task.schedules.inputs)}
  //     </div>
  //     <div className={classes.inputsContainer}>
  //       <H24>Devices</H24>
  //       <div className={classes.optionsMain}>
  //         <p className={classes.optionName}>
  //           <span className={classes.click} onClick={showDevicesHandler}>
  //             Click
  //           </span>{" "}
  //           to view Selected Devices
  //         </p>
  //       </div>
  //     </div>
      // {disabled ? (
      //   <GreyButton handler={saveHandler}>Save & Start</GreyButton>
      // ) : (
      //   <DisabledButton>Save & Start</DisabledButton>
      // )}
  //   </div>
  // );


  return (
    <div className={classes.main}>
      <div className={classes.inputsContainer}>
        <H24>Inputs</H24>
        {task.inputs.inputs.map((section, index) => (
          <ScheduleSection key={index} title={section.name}>
            {section.inputs.map((input, inputIndex) => {
              if (input.type === "instagrmFollowerBotAcountWise") {
                return (
                  <div key={inputIndex}>
                    {input.Accounts.map((account, accIndex) => {
                      // Filter only enabled inputs for this account
                      const enabledInputs = account.inputs.filter(input => input.input);
                      
                      if (enabledInputs.length === 0) return null;
                      
                      return (
                        <div key={accIndex} className={classes.accountContainer}>
                          <h3 className={classes.accountUsername}>Account: {account.username}</h3>
                          {enabledInputs.map((accountInput, accountInputIndex) => (
                            <div key={accountInputIndex} className="mb-4">
                              <OptionDisplay
                                name={accountInput.name}
                                value={renderInput(accountInput)}
                                el={accountInput}
                              />
                              {renderInputDetails(accountInput)}
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              } else {
                return (
                  <div key={inputIndex}>
                    <OptionDisplay
                      name={input.name}
                      value={renderInput(input)}
                      el={input}
                    />
                    {renderInputDetails(input)}
                  </div>
                );
              }
            })}
          </ScheduleSection>
        ))}
      </div>
      <div className={classes.inputsContainer}>
        <H24>Schedule</H24>
        {renderSchedule(task.schedules.inputs)}
      </div>
      <div className={classes.inputsContainer}>
        <H24>Devices</H24>
        <div className={classes.optionsMain}>
          <p className={classes.optionName}>
            <span className={classes.click} onClick={showDevicesHandler}>
              Click
            </span>{" "}
            to view Selected Devices
          </p>
        </div>
      </div>
      {disabled ? (
        <GreyButton handler={saveHandler}>Save & Start</GreyButton>
      ) : (
        <DisabledButton>Save & Start</DisabledButton>
      )}
    </div>
  );
}

export default Save;
