import { toast } from "sonner";
import BlueTick from "../assets/Icons/BlueTick";
import Cross from "../assets/Icons/Cross";
import Spinner from "../assets/Spinner/Spinner";
import classes from "./utils.module.css";
import H18 from "../Components/Headings/H18";

export function loadingToast(message) {
  const id = toast(message, {
    style: {
      width: "max-content",
      color: "#f3f4fa",
      backgroundColor: "#252832",
      border: "1px solid #414758",
      display: "flex",
      gap: "24px",
      marginTop: "20px",
      padding: "12px 14px",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
    },
    duration: Infinity,
    icon: <Spinner />,
  });
  return id;
}

export function updateLoadingToast(id) {
  toast.dismiss(id);
}

export function failToast(message) {
  toast(message, {
    style: {
      width: "max-content",
      color: "#f3f4fa",
      backgroundColor: "#40191b",
      border: "1px solid #aa3229",
      display: "flex",
      gap: "8px",
      marginTop: "20px",
      padding: "8px 12px",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
    },
    duration: 3000,
    icon: <Cross color="#aa3229" />,
  });
}

export function successToast(message) {
  toast(message, {
    style: {
      width: "max-content",
      color: "#f3f4fa",
      backgroundColor: "#14441f",
      border: "1px solid #068a35",
      display: "flex",
      gap: "8px",
      marginTop: "20px",
      padding: "8px 12px",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
    },
    duration: 2000,
    icon: <BlueTick color="#068a35" />,
  });
}

function validateTimeWindowwithduration(el) {
  const startTime = new Date(`2000-01-01T${el.startinput}`);
  let endTime = new Date(`2000-01-01T${el.endinput}`);
  let timeDiffMinutes;
  if (el.startinput === el.endinput) {
    timeDiffMinutes = 24 * 60;
  } else {
    if (endTime <= startTime) {
      endTime.setDate(endTime.getDate() + 1);
    }
    timeDiffMinutes = (endTime - startTime) / (1000 * 60);
  }
  if (timeDiffMinutes < el.durationInput) {
    failToast("The Time window must be greater than or equal to the Run Time.");
    return false;
  }

  return true;
}

export function schedulingInputsValidater(el) {
  console.log("Entered schedulingInputsValidater");
  console.log(el);
  switch (el.type) {
    case "DurationWithExactStartTime":
      if (el.durationInput <= 0) {
        failToast("Please set a Fixed Run Time.");
        return false;
      } else if (el.timeInput === "") {
        failToast("Please set Exact Start Time.");
        return false;
      }
      return true;
    case "DurationWithTimeWindow":
      if (el.durationInput <= 0) {
        failToast("Please set a Custom Daily Run Time.");
        return false;
      } else if (el.startinput === "") {
        failToast("Please set Start Time.");
        return false;
      } else if (el.endinput === "") {
        failToast("Please set End Time.");
        return false;
      }
      return validateTimeWindowwithduration(el);

    case "ExactStartTime":
      if (el.timeInput === "") {
        failToast("Please set Start time for Fixed start time.");
        return false;
      }
      return true;

    case "EveryDayAutomaticRun":
      if (el.startinput === "") {
        failToast("Please set Start Time for Automatic Daily Run Time.");
        return false;
      } else if (el.endinput === "") {
        failToast("Please set End Time for Automatic Daily Run Time.");
        return false;
      }
      return true;
  }
}

const TimeDisplay = (time) => {
  if (time === 0) return "not set";
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  return `${hours} hours and ${minutes} minutes`;
};

// export function renderInputDetails(input) {
//   return (
//     <>
//       {input.input && input.type === "toggleUrlandKeyword" && (
//         <div className={classes.optionsMain}>
//           <p className={classes.optionName}>Profile Url:</p>
//           {input.url !== "" ? (
//             <p className={classes.optionName}>
//               <a href={input.url} target="_blank">
//                 {input.url}
//               </a>
//             </p>
//           ) : (
//             <p className={classes.optionName}>-</p>
//           )}
//         </div>
//       )}
//       {input.input &&
//         (input.type === "togglewithkeywords" ||
//           input.type === "toggleUrlandKeyword") && (
//           <>
//             <div className={classes.optionsMain}>
//               <p className={classes.optionName}>Positive keywords:</p>
//               {input.positiveKeywords.length !== 0 ? (
//                 <p className={classes.optionName}>
//                   {input.positiveKeywords.join(", ")}
//                 </p>
//               ) : (
//                 <p className={classes.optionName}>-</p>
//               )}
//             </div>
//             <div className={classes.optionsMain}>
//               <p className={classes.optionName}>Negative keywords:</p>
//               {input.negativeKeywords.length !== 0 ? (
//                 <p className={classes.optionName}>
//                   {input.negativeKeywords.join(", ")}
//                 </p>
//               ) : (
//                 <p className={classes.optionName}>-</p>
//               )}
//             </div>
//             <div className={classes.optionsMain}>
//               <p className={classes.optionName}>Minimum Mutual Friends:</p>
//               <p className={classes.optionName}>{input.mutualFriendsCount}</p>
//             </div>
//           </>
//         )}
//       {input.input && input.type === "toggleKeywordsAndGap" && (
//         <>
//           <div className={classes.optionsMain}>
//             <p className={classes.optionName}>Excluded Accounts:</p>
//             {input.usernamesToExclude.length !== 0 ? (
//               <p className={classes.optionName}>
//                 {input.usernamesToExclude.join(", ")}
//               </p>
//             ) : (
//               <p className={classes.optionName}>-</p>
//             )}
//           </div>
//         </>
//       )}
//     </>
//   );
// }

// export const OptionDisplay = (props) => {
//   return (
//     <>
//       <div className={classes.optionsMain}>
//         <p className={classes.optionName}>{props.name}:</p>
//         <p className={classes.optionName}>{props.value}</p>
//       </div>
//     </>
//   );
// };

// export const ScheduleSection = ({ title, children }) => (
//   <div className={classes.sections}>
//     <H18>{title}</H18>
//     {children}
//   </div>
// );

const formatTimeInMinutes = (minutes) => {
  if (minutes === 0) return "0 minutes";
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  let result = "";
  if (hours > 0) {
    result += `${hours} hour${hours > 1 ? 's' : ''}`;
  }
  
  if (remainingMinutes > 0) {
    if (result) result += " and ";
    result += `${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
  }
  
  return result;
};


export const OptionDisplay = (props) => {
  return (
    <div className={classes.optionsMain}>
      <p className={classes.optionName}>{props.name}:</p>
      <p className={classes.optionName}>{props.value}</p>
    </div>
  );
};

// Section with title and children
export const ScheduleSection = ({ title, children }) => (
  <div className={classes.sections}>
    <H18>{title}</H18>
    {children}
  </div>
);

// Render the details of each input based on its type and whether it's enabled
export const renderInputDetails = (input) => {
  return (
    <>
      {input.input && input.type === "toggleUrlAndKeyword" && (
        <div className={classes.optionsMain}>
          <p className={classes.optionName}>Profile Url:</p>
          {input.url !== "" ? (
            <p className={classes.optionName}>
              <a href={input.url} target="_blank" rel="noopener noreferrer">
                {input.url}
              </a>
            </p>
          ) : (
            <p className={classes.optionName}>-</p>
          )}
        </div>
      )}
      {input.input &&
        (input.type === "toggleWithKeywords" ||
          input.type === "toggleUrlAndKeyword") && (
          <>
            <div className={classes.optionsMain}>
              <p className={classes.optionName}>Positive keywords:</p>
              {input.positiveKeywords && input.positiveKeywords.length !== 0 ? (
                <p className={classes.optionName}>
                  {input.positiveKeywords.join(", ")}
                </p>
              ) : (
                <p className={classes.optionName}>-</p>
              )}
            </div>
            <div className={classes.optionsMain}>
              <p className={classes.optionName}>Negative keywords:</p>
              {input.negativeKeywords && input.negativeKeywords.length !== 0 ? (
                <p className={classes.optionName}>
                  {input.negativeKeywords.join(", ")}
                </p>
              ) : (
                <p className={classes.optionName}>-</p>
              )}
            </div>
            <div className={classes.optionsMain}>
              <p className={classes.optionName}>Minimum Mutual Friends:</p>
              <p className={classes.optionName}>{input.mutualFriendsCount}</p>
            </div>
            <div className={classes.optionsMain}>
              <p className={classes.optionName}>Follows Per Hour:</p>
              <p className={classes.optionName}>{input.minFollowsPerHour} - {input.maxFollowsPerHour}</p>
            </div>
            <div className={classes.optionsMain}>
              <p className={classes.optionName}>Follows Per Day:</p>
              <p className={classes.optionName}>{input.minFollowsDaily} - {input.maxFollowsDaily}</p>
            </div>
                <div className={classes.optionsMain}>
                  <p className={classes.optionName}>Minimum Sleep Time:</p>
                  <p className={classes.optionName}>{formatTimeInMinutes(input.minSleepTime)}</p>
                </div>
                <div className={classes.optionsMain}>
                  <p className={classes.optionName}>Maximum Sleep Time:</p>
                  <p className={classes.optionName}>{formatTimeInMinutes(input.maxSleepTime)}</p>
                </div>
          </>
        )}
      {input.input && input.type === "toggleAndGap" && (
        <>
          <div className={classes.optionsMain}>
            <p className={classes.optionName}>Minimum Sleep Time:</p>
            <p className={classes.optionName}>{formatTimeInMinutes(input.minSleepTime)}</p>
          </div>
          <div className={classes.optionsMain}>
            <p className={classes.optionName}>Maximum Sleep Time:</p>
            <p className={classes.optionName}>{formatTimeInMinutes(input.maxSleepTime)}</p>
          </div>
        </>
      )}
      {input.input && input.type === "toggleAndUnFollowInputs" && (
        <>
          <div className={classes.optionsMain}>
            <p className={classes.optionName}>Unfollows Per Hour:</p>
            <p className={classes.optionName}>{input.minUnFollowsPerHour} - {input.maxUnFollowsPerHour}</p>
          </div>
          <div className={classes.optionsMain}>
            <p className={classes.optionName}>Unfollows Per Day:</p>
            <p className={classes.optionName}>{input.minUnFollowsDaily} - {input.maxUnFollowsDaily}</p>
          </div>
          <div className={classes.optionsMain}>
            <p className={classes.optionName}>Excluded Users:</p>
            {input.usersToExcludeList && input.usersToExcludeList.length !== 0 ? (
              <p className={classes.optionName}>
                {input.usersToExcludeList.join(", ")}
              </p>
            ) : (
              <p className={classes.optionName}>-</p>
            )}
          </div>
          <div className={classes.optionsMain}>
            <p className={classes.optionName}>Unfollowing Type:</p>
            <p className={classes.optionName}>{input.typeOfUnfollowing}</p>
          </div>
              <div className={classes.optionsMain}>
                <p className={classes.optionName}>Minimum Sleep Time:</p>
                <p className={classes.optionName}>{formatTimeInMinutes(input.minSleepTime)}</p>
              </div>
              <div className={classes.optionsMain}>
                <p className={classes.optionName}>Maximum Sleep Time:</p>
                <p className={classes.optionName}>{formatTimeInMinutes(input.maxSleepTime)}</p>
              </div>
        </>
      )}
    </>
  );
};





const RunTimeDisplay = ({ name, value }) => (
  <OptionDisplay name={name} value={TimeDisplay(value)} />
);


export function renderSchedule(inputs) {
  if (!inputs || inputs.length === 0) {
    return <p>No schedule selected.</p>;
  }

  // Filter for selected schedules
  const selectedSchedules = inputs.filter((schedule) => schedule.selected);

  if (selectedSchedules.length === 0) {
    return <p>No schedule selected.</p>;
  }

  return selectedSchedules.map((schedule, index) => (
    <ScheduleSection key={index} title={schedule.Heading}>
      {schedule.type === "DurationWithExactStartTime" && (
        <>
          <RunTimeDisplay
            name="Fixed Run Time"
            value={schedule.durationInput}
          />
          <OptionDisplay
            name="Exact Start Time"
            value={`${schedule.timeInput || "Not set"}`}
          />
        </>
      )}
      {schedule.type === "DurationWithTimeWindow" && (
        <>
          <RunTimeDisplay
            name="Custom Daily Run Time"
            value={schedule.durationInput}
          />
          <OptionDisplay
            name="Randomized Start Time within a Window"
            value={`${schedule.startinput || "Not set"} - ${
              schedule.endinput || "Not set"
            }`}
          />
        </>
      )}
      {schedule.type === "ExactStartTime" && (
        <OptionDisplay
          name="Fixed Start Time"
          value={`${schedule.timeInput || "Not set"}`}
        />
      )}
      {schedule.type === "EveryDayAutomaticRun" && (
        <OptionDisplay
          name={schedule.firstInputname}
          value={`${schedule.startinput || "Not set"} - ${
            schedule.endinput || "Not set"
          }`}
        />
      )}
    </ScheduleSection>
  ));
}



export function transformData(data) {
  const transformed = [];
  
  // Helper function to process common input types
  const processInput = (inputItem) => {
    const baseType = inputItem.type;
    const result = { [inputItem.name]: inputItem.input };
    
    // Map of input types to their additional properties
    const typeProperties = {
      toggleWithKeywords: ['positiveKeywords', 'negativeKeywords', 'mutualFriendsCount', 
                          'minFollowsPerHour', 'maxFollowsPerHour', 'minFollowsDaily', 
                          'maxFollowsDaily', 'minSleepTime', 'maxSleepTime'],
      
      toggleUrlAndKeyword: ['url', 'positiveKeywords', 'negativeKeywords', 'mutualFriendsCount', 
                           'minFollowsPerHour', 'maxFollowsPerHour', 'minFollowsDaily', 
                           'maxFollowsDaily', 'minSleepTime', 'maxSleepTime'],
      
      toggleAndUnFollowInputs: ['minFollowsPerHour', 'maxFollowsPerHour', 'minFollowsDaily', 
                               'maxFollowsDaily', 'minSleepTime', 'maxSleepTime', 
                               'typeOfUnfollowing', 'usersToExcludeList'],
      
      toggleAndGap: ['minSleepTime', 'maxSleepTime'],
      
      toggleKeywordsAndGap: ['usernamesToExclude'],
      
      toggleDiscordAnalysis: ['serverId', 'channelId']
    };
    
    // Add properties based on input type
    if (baseType in typeProperties) {
      typeProperties[baseType].forEach(prop => {
        if (inputItem[prop] !== undefined) {
          result[prop] = inputItem[prop];
        }
      });
    }
    
    return result;
  };

  for (const section of data) {
    // Check if this is an Instagram follower bot account-wise section
    if (section.inputs.length && 
        section.inputs[0].type === "instagrmFollowerBotAcountWise" && 
        section.inputs[0].Accounts) {
      
      // Process each account
      for (const account of section.inputs[0].Accounts) {
        transformed.push({
          username: account.username,
          inputs: account.inputs.map(processInput)
        });
      }
    } else {
      // Handle other section types
      transformed.push({
        [section.name]: section.inputs.map(processInput)
      });
    }
  }

  return transformed;
}

export function transformDataForSchedule(data) {
  console.log("Entered transformDataForSchedule");
  const selectedDurationInput = data.inputs.find((input) => input.selected);
  switch (selectedDurationInput.type) {
    case "DurationWithExactStartTime":
      return {
        durationType: selectedDurationInput.type,
        duration: parseInt(selectedDurationInput.durationInput),
        exactStartTime: selectedDurationInput.timeInput,
      };
    case "DurationWithTimeWindow":
      return {
        durationType: selectedDurationInput.type,
        duration: parseInt(selectedDurationInput.durationInput),
        startInput: selectedDurationInput.startinput,
        endInput: selectedDurationInput.endinput,
      };
    case "ExactStartTime":
      return {
        durationType: selectedDurationInput.type,
        exactStartTime: selectedDurationInput.timeInput,
      };
    case "EveryDayAutomaticRun":
      return {
        durationType: selectedDurationInput.type,
        startInput: selectedDurationInput.startinput,
        endInput: selectedDurationInput.endinput,
      };
  }
}


export function validateInputs(data) {
  console.log("Entered validateInputs");
  console.log(data);

  for (const item of data) {
    const { type, name, inputs } = item;

    // ✅ Special handling for type 3
    if (inputs.length && inputs[0]?.type === "instagrmFollowerBotAcountWise" && inputs[0].Accounts) {
      for (const account of inputs[0].Accounts) {
        const inputsCheck = account.inputs.filter((input1) => input1.input);

        for (const input of inputsCheck) {
          if (
            input.type === "toggleWithKeywords" ||
            input.type === "toggleUrlAndKeyword"
          ) {
            if (input.type === "toggleUrlAndKeyword" && input.url === "") {
              failToast(`Please Enter Correct Profile URL for ${account.username}`);
              return false;
            }
            if (input.mutualFriendsCount < 1) {
              failToast(`Please Set mutual Friends to at least 1 for ${account.username}`);
              return false;
            }
            if (input.minFollowsPerHour > input.maxFollowsPerHour) {
              failToast(
                `Minimum Follows per Hour should be less than Maximum Follows per Hour for ${account.username}`
              );
              return false;
            }
            if (input.minFollowsDaily > input.maxFollowsDaily) {
              failToast(
                `Minimum Follows per Day should be less than Maximum Follows per Day for ${account.username}`
              );
              return false;
            }
            if (input.minSleepTime > input.maxSleepTime) {
              failToast(
                `Minimum Sleep time should be less than or equal to Maximum Sleep time for ${account.username}`
              );
              return false;
            }
          } else if (input.type === "toggleAndGap") {
            if (input.minSleepTime > input.maxSleepTime) {
              failToast(
                `Minimum Sleep time should be less than or equal to Maximum Sleep time for ${account.username}`
              );
              return false;
            }
          }
        }
      }

      continue; // ✅ Skip the rest of the loop for type 3
    }

    // ✅ Type One check for exactly one input set to true
    if (type === "one") {
      const inputsCheck = inputs.filter((input1) => input1.input);
      if (inputsCheck.length !== 1) {
        failToast(
          inputsCheck.length === 0
            ? `At least one Input of ${name} should be True`
            : `Only one Input of ${name} should be True`
        );
        return false;
      }
    }

    // ✅ Validate inputs for type one and two (general case)
    const inputsCheck = inputs.filter((input1) => input1.input);
    for (const input of inputsCheck) {
      if (
        input.type === "toggleWithKeywords" ||
        input.type === "toggleUrlAndKeyword"
      ) {
        if (input.type === "toggleUrlAndKeyword" && input.url === "") {
          failToast(`Please Enter Correct Profile URL`);
          return false;
        }
        if (input.mutualFriendsCount < 1) {
          failToast("Please Set mutual Friends to at least 1");
          return false;
        }
        if (input.minFollowsPerHour > input.maxFollowsPerHour) {
          failToast(
            `Minimum Follows per Hour should be less than Maximum Follows per Hour`
          );
          return false;
        }
        if (input.minFollowsDaily > input.maxFollowsDaily) {
          failToast(
            `Minimum Follows per Day should be less than Maximum Follows per Day`
          );
          return false;
        }
        if (input.minSleepTime > input.maxSleepTime) {
          failToast(
            `Minimum Sleep time should be less than or equal to Maximum Sleep time`
          );
          return false;
        }
      } else if (input.type === "toggleAndGap") {
        if (input.minSleepTime > input.maxSleepTime) {
          failToast(
            `Minimum Sleep time should be less than or equal to Maximum Sleep time`
          );
          return false;
        }
      }
    }
  }

  return true;
}
