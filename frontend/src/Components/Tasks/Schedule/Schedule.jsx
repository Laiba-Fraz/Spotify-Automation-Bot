// import classes from "./Schedule.module.css";
// import GreyButton from "../../Buttons/GreyButton";
// import RightChevron from "../../../assets/Icons/RightChevron";
// import { useEffect, useState } from "react";
// import Input from "../../Inputs/Input";
// import { failToast, successToast } from "../../../Utils/utils";
// import SchedulesInput from "./../../Inputs/SchedulesInput/SchedulesInput";

// function Schedule(props) {
//   const [inputs, setInputs] = useState(
//     props.schedules ? props.schedules : null
//   );
//   const [inputsShowList, setInputsShowList] = useState([]);
//   // const [duration, setDuration] = useState("00:00");

//   useEffect(() => {
//     props.setScheduleHandler(inputs);
//   }, [inputs]);

//   function nextHandler() {
//     successToast("Schedules saved");
//     props.nextHandler("Save");
//   }
//   const showDivHandler = (index) => {
//     if (inputsShowList.includes(index)) {
//       setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
//     } else {
//       setInputsShowList((prevstate) => [...prevstate, index]);
//     }
//   };

//   function durationChangeHandler(value, index, innerIndex) {
//     setInputs((prevState) =>
//       prevState.map((item, i) => {
//         if (i === index && item.type.trim() === "one") {
//           // If type is 'one', set the value for the selected input and reset others to ""
//           return {
//             ...item,
//             inputs: item.inputs.map((el, innerI) =>
//               innerI === innerIndex
//                 ? { ...el, input: value }
//                 : { ...el, input: "" }
//             ),
//           };
//         } else if (i === index) {
//           // For non-"one" types, just update the specific input
//           return {
//             ...item,
//             inputs: item.inputs.map((el, innerI) =>
//               innerI === innerIndex ? { ...el, input: value } : el
//             ),
//           };
//         }
//         return item;
//       })
//     );
//   }

//   function durationBlurHandler(value, index, innerIndex) {
//     const timePattern = /^([0-1][0-9]|2[0-4]):([0-5][0-9]|60)$/;

//     if (!timePattern.test(inputs[index].inputs[innerIndex].input)) {
//       failToast("Incorrect bot runtime");

//       // Reset the value to "00:00" on invalid input
//       setInputs((prevState) =>
//         prevState.map((item, i) =>
//           i === index
//             ? {
//                 ...item,
//                 inputs: item.inputs.map((el, innerI) =>
//                   innerI === innerIndex ? { ...el, input: "00:00" } : el
//                 ),
//               }
//             : item
//         )
//       );
//     }
//   }

//   function timeChangeHandler(value, index, innerIndex) {}

//   function timeBlurHandler(value, index, innerIndex) {}

//   function inputsToggleChangeHandler(index) {
//     console.log(inputs);
//     setInputs((prevstate) =>
//       prevstate.map((item, i) =>
//         i === index ? { ...item, input: !item.input } : item
//       )
//     );
//   }
//   function inputChangeHandler(value, index) {
//     console.log(inputs);
//     setInputs((prevstate) =>
//       prevstate.map((item, i) =>
//         i === index ? { ...item, input: value } : item
//       )
//     );
//   }

//   function renderInputContent(el, index, innerIndex) {
//     switch (el.type) {
//       case "toggle":
//         return (
//           <div className={classes.sswitchInputContainer}>
//             <label className={classes.switch}>
//               <input
//                 type="checkbox"
//                 checked={el.input}
//                 onChange={() => {
//                   inputsToggleChangeHandler(index);
//                 }}
//               />
//               <span className={classes.slider}></span>
//             </label>
//             <p>{el.name}</p>
//           </div>
//         );
//       case "input":
//         return (
//           <Input
//             type={el.inputType}
//             label={el.name}
//             notrequired={true}
//             value={el.input}
//             handler={(value) => {
//               inputChangeHandler(value, index);
//             }}
//           />
//         );
//       case "duration":
//         return (
//           <SchedulesInput
//             type={el.inputType}
//             notrequired={true}
//             placeholder={"00:00 (hh:mm)"}
//             value={el.input}
//             handler={(value) => {
//               durationChangeHandler(value, index, innerIndex);
//             }}
//             blurHandler={(value) => {
//               durationBlurHandler(value, index, innerIndex);
//             }}
//           />
//         );
//       case "time":
//         return (
//           <>
//             <label>start time</label>
//             <input type="time" id="appt" name="appt" min="00:00" max="24:00" />
//           </>
//         );
//       case "timePeriod":
//         return (
//           <>
//             <label>start time</label>
//             <input type="time" id="appt" name="appt" min="00:00" max="24:00" />
//             <label>end time</label>
//             <input type="time" id="appt" name="appt" min="00:00" max="24:00" />
//           </>
//         );
//       default:
//         return <p>Unknown input type</p>;
//     }
//   }

//   return (
//     <div className={classes.main}>
//       <div className={classes.main}>
//         <div className={classes.inputsContainer}>
//           {inputs.map((el, index) => {
//             return (
//               <div className={classes.inputsBtnContainer}>
//                 <button
//                   className={`${classes.Inputbutton} ${
//                     inputsShowList.includes(index) ? classes.opened : ""
//                   }`}
//                   onClick={() => showDivHandler(index)}
//                 >
//                   <div className={classes.chevronCont}>
//                     <RightChevron
//                       class={inputsShowList.includes(index) ? "rotate" : ""}
//                     />
//                   </div>
//                   <p>{el.name}</p>
//                 </button>
//                 {inputsShowList.includes(index) && (
//                   <div className={classes.hiddendiv}>
//                     {el.inputs.map((input, innerIndex) => {
//                       return (
//                         <>
//                           <div className={classes.hiddenDivInnerMain}>
//                             <p className={classes.InputName}>{input.name}</p>
//                             <div className={classes.descriptionContainer}>
//                               <p>{input.description}</p>
//                             </div>
//                             {renderInputContent(input, index, innerIndex)}
//                             {input.subDescription && (
//                               <p className={classes.subDescription}>
//                                 {input.subDescription}
//                               </p>
//                             )}
//                           </div>
//                           {el.type === "one" &&
//                             el.inputs.length > innerIndex + 1 && (
//                               <p className={classes.or}>or</p>
//                             )}
//                         </>
//                       );
//                     })}
//                     {/* <div className={classes.descriptionContainer}>
//                       <p>{el.description}</p>
//                     </div>
//                     <div className={classes.inputCont}>
//                       {renderInputContent(el, index)}
//                     </div> */}
//                     {el.description && (
//                       <p className={classes.finalSubDescription}>
//                         {el.description}
//                       </p>
//                     )}
//                   </div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//       <GreyButton handler={nextHandler}>Next</GreyButton>
//     </div>
//   );
// }

// export default Schedule;
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import classes from "./Schedule.module.css";
// import GreyButton from "../../Buttons/GreyButton";
// import RightChevron from "../../../assets/Icons/RightChevron";
// import { failToast, successToast } from "../../../Utils/utils";
// import SchedulesInput from "./../../Inputs/SchedulesInput/SchedulesInput";

// function Schedule(props) {
//   const [inputs, setInputs] = useState(props.schedules || []);
//   const [inputsShowList, setInputsShowList] = useState([]);

//   useEffect(() => {
//     props.setScheduleHandler(inputs);
//   }, [inputs]);

//   function nextHandler() {
//     // Check if any inputs are empty
//     const botRunTimeInputs = inputs[0].inputs;
//     const startTimeInputs = inputs[1].inputs;

//     const fixedRunTimeSelected = botRunTimeInputs[0].input !== "00:00";
//     const customRunTimeSelected = botRunTimeInputs[1].input !== "00:00";

//     const exactStartTimeSelected = startTimeInputs[0].input !== "";
//     const randomizedStartTimeSelected =
//       startTimeInputs[1].startinput !== "" &&
//       startTimeInputs[1].endinput !== "";

//     if (!fixedRunTimeSelected && !customRunTimeSelected) {
//       failToast(
//         "Please select either Fixed Run Time or Custom Daily Run Time."
//       );
//       return;
//     }

//     if (fixedRunTimeSelected && !exactStartTimeSelected) {
//       failToast("Please select an Exact Start Time for Fixed Run Time.");
//       return;
//     }

//     if (customRunTimeSelected && !randomizedStartTimeSelected) {
//       failToast(
//         "Please select a Randomized Start Time for Custom Daily Run Time."
//       );
//       return;
//     }

//     if (customRunTimeSelected) {
//       const customDuration = botRunTimeInputs[1].input.split(":");
//       const customMinutes =
//         parseInt(customDuration[0]) * 60 + parseInt(customDuration[1]);

//       const start = new Date(`2000-01-01T${startTimeInputs[1].startinput}`);
//       const end = new Date(`2000-01-01T${startTimeInputs[1].endinput}`);

//       let diffMinutes = (end - start) / (1000 * 60);
//       if (end < start) {
//         diffMinutes += 24 * 60; // Add 24 hours if end time is on the next day
//       }

//       if (diffMinutes < customMinutes) {
//         failToast(
//           "Time window must be greater than the Custom Daily Run Time."
//         );
//         return;
//       }
//     }

//     successToast("Schedules saved");
//     props.nextHandler("Save");
//   }

//   const showDivHandler = (index) => {
//     if (inputsShowList.includes(index)) {
//       setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
//     } else {
//       setInputsShowList((prevstate) => [...prevstate, index]);
//     }
//   };

//   function durationChangeHandler(value, index, innerIndex) {
//     setInputs((prevState) =>
//       prevState.map((item, i) => {
//         if (i === index && item.type === "one") {
//           return {
//             ...item,
//             inputs: item.inputs.map((el, innerI) =>
//               innerI === innerIndex
//                 ? { ...el, input: value }
//                 : { ...el, input: "00:00" }
//             ),
//           };
//         } else if (i === index) {
//           return {
//             ...item,
//             inputs: item.inputs.map((el, innerI) =>
//               innerI === innerIndex ? { ...el, input: value } : el
//             ),
//           };
//         }
//         return item;
//       })
//     );

//     // Clear start time settings when changing bot run time
//     setInputs((prevState) =>
//       prevState.map((item, i) => {
//         if (i === 1) {
//           return {
//             ...item,
//             inputs: item.inputs.map((el) => ({
//               ...el,
//               input: "",
//               startinput: "",
//               endinput: "",
//             })),
//           };
//         }
//         return item;
//       })
//     );
//   }

//   function durationBlurHandler(value, index, innerIndex) {
//     const timePattern = /^([0-1][0-9]|2[0-4]):([0-5][0-9])$/;

//     if (!timePattern.test(value)) {
//       failToast("Incorrect bot runtime");
//       setInputs((prevState) =>
//         prevState.map((item, i) =>
//           i === index
//             ? {
//                 ...item,
//                 inputs: item.inputs.map((el, innerI) =>
//                   innerI === innerIndex ? { ...el, input: "00:00" } : el
//                 ),
//               }
//             : item
//         )
//       );
//     }
//   }

//   function timeChangeHandler(value, index, innerIndex, type) {
//     setInputs((prevState) =>
//       prevState.map((item, i) =>
//         i === index
//           ? {
//               ...item,
//               inputs: item.inputs.map((el, innerI) =>
//                 innerI === innerIndex
//                   ? type === "exact"
//                     ? { ...el, input: value }
//                     : type === "start"
//                     ? { ...el, startinput: value }
//                     : { ...el, endinput: value }
//                   : el
//               ),
//             }
//           : item
//       )
//     );
//   }

//   function renderInputContent(el, index, innerIndex) {
//     switch (el.type) {
//       case "duration":
//         return (
//           <SchedulesInput
//             type={el.inputType}
//             notrequired={true}
//             placeholder={"00:00 (hh:mm)"}
//             value={el.input}
//             handler={(value) => {
//               durationChangeHandler(value, index, innerIndex);
//             }}
//             blurHandler={(value) => {
//               durationBlurHandler(value, index, innerIndex);
//             }}
//           />
//         );
//       case "time":
//         return (
//           <>
//             <label>Exact Start Time</label>
//             <input
//               type="time"
//               value={el.input}
//               onChange={(e) =>
//                 timeChangeHandler(e.target.value, index, innerIndex, "exact")
//               }
//               min="00:00"
//               max="23:59"
//             />
//           </>
//         );
//       case "timePeriod":
//         return (
//           <>
//             <label>Start Time</label>
//             <input
//               type="time"
//               value={el.startinput}
//               onChange={(e) =>
//                 timeChangeHandler(e.target.value, index, innerIndex, "start")
//               }
//               min="00:00"
//               max="23:59"
//             />
//             <label>End Time</label>
//             <input
//               type="time"
//               value={el.endinput}
//               onChange={(e) =>
//                 timeChangeHandler(e.target.value, index, innerIndex, "end")
//               }
//               min="00:00"
//               max="23:59"
//             />
//           </>
//         );
//       default:
//         return <p>Unknown input type</p>;
//     }
//   }

//   return (
//     <div className={classes.main}>
//       <div className={classes.inputsContainer}>
//         {inputs.map((el, index) => (
//           <div className={classes.inputsBtnContainer} key={index}>
//             <button
//               className={`${classes.Inputbutton} ${
//                 inputsShowList.includes(index) ? classes.opened : ""
//               }`}
//               onClick={() => showDivHandler(index)}
//             >
//               <div className={classes.chevronCont}>
//                 <RightChevron
//                   class={inputsShowList.includes(index) ? "rotate" : ""}
//                 />
//               </div>
//               <p>{el.name}</p>
//             </button>
//             {inputsShowList.includes(index) && (
//               <div className={classes.hiddendiv}>
//                 {el.inputs.map((input, innerIndex) => (
//                   <div key={innerIndex}>
//                     <div className={classes.hiddenDivInnerMain}>
//                       <p className={classes.InputName}>{input.name}</p>
//                       <div className={classes.descriptionContainer}>
//                         <p>{input.description}</p>
//                       </div>
//                       {renderInputContent(input, index, innerIndex)}
//                       {input.subDescription && (
//                         <p className={classes.subDescription}>
//                           {input.subDescription}
//                         </p>
//                       )}
//                     </div>
//                     {el.type === "one" && el.inputs.length > innerIndex + 1 && (
//                       <p className={classes.or}>or</p>
//                     )}
//                   </div>
//                 ))}
//                 {el.description && (
//                   <p className={classes.finalSubDescription}>
//                     {el.description}
//                   </p>
//                 )}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <GreyButton handler={nextHandler}>Next</GreyButton>
//     </div>
//   );
// }

// export default Schedule;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import classes from "./Schedule.module.css";
// import GreyButton from "../../Buttons/GreyButton";
// import RightChevron from "../../../assets/Icons/RightChevron";
// import { failToast, successToast } from "../../../Utils/utils";
// import SchedulesInput from "./../../Inputs/SchedulesInput/SchedulesInput";
// import DurationInput from "./DurationInput";

// function Schedule(props) {
//   const [inputs, setInputs] = useState(props.schedules || []);
//   const [inputsShowList, setInputsShowList] = useState([]);

//   useEffect(() => {
//     props.setScheduleHandler(inputs);
//   }, [inputs]);

//   function validateInputs() {
//     const botRunTimeInputs = inputs[0].inputs;
//     const startTimeInputs = inputs[1].inputs;

//     const fixedRunTime = botRunTimeInputs[0];
//     const customRunTime = botRunTimeInputs[1];
//     const exactStartTime = startTimeInputs[0];
//     const randomizedStartTime = startTimeInputs[1];

//     if (fixedRunTime.selected) {
//       if (fixedRunTime.input === 0) {
//         failToast("Please set a Fixed Run Time.");
//         return false;
//       }
//       if (exactStartTime.input === "") {
//         failToast("Please set an Exact Start Time for Fixed Run Time.");
//         return false;
//       }
//     } else if (customRunTime.selected) {
//       if (customRunTime.input === 0) {
//         failToast("Please set a Custom Daily Run Time.");
//         return false;
//       }
//       if (
//         randomizedStartTime.startinput === "" ||
//         randomizedStartTime.endinput === ""
//       ) {
//         failToast(
//           "Please set a Randomized Start Time window for Custom Daily Run Time."
//         );
//         return false;
//       }

//       const customRunTimeMinutes = customRunTime.input;
//       const startTime = new Date(
//         `2000-01-01T${randomizedStartTime.startinput}`
//       );
//       let endTime = new Date(`2000-01-01T${randomizedStartTime.endinput}`);

//       let timeDiffMinutes;
//       if (randomizedStartTime.startinput === randomizedStartTime.endinput) {
//         timeDiffMinutes = 24 * 60;
//       } else {
//         if (endTime <= startTime) {
//           endTime.setDate(endTime.getDate() + 1);
//         }
//         timeDiffMinutes = (endTime - startTime) / (1000 * 60);
//       }

//       if (timeDiffMinutes < customRunTimeMinutes) {
//         failToast(
//           "The Randomized Start Time window must be greater than or equal to the Custom Daily Run Time."
//         );
//         return false;
//       }
//     } else {
//       failToast(
//         "Please select either Fixed Run Time or Custom Daily Run Time."
//       );
//       return false;
//     }

//     return true;
//   }

//   function nextHandler() {
//     if (validateInputs()) {
//       successToast("Schedules saved");
//       props.nextHandler("Save");
//     }
//   }

//   const showDivHandler = (index) => {
//     if (inputsShowList.includes(index)) {
//       setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
//     } else {
//       setInputsShowList((prevstate) => [...prevstate, index]);
//     }
//   };

//   // function durationChangeHandler(value, index, innerIndex, type) {
//   //   setInputs((prevState) =>
//   //     prevState.map((item, i) => {
//   //       if (i === index) {
//   //         return {
//   //           ...item,
//   //           inputs: item.inputs.map((el, innerI) => {
//   //             if (innerI === innerIndex) {
//   //               let newInput = el.input;
//   //               const currentHours = Math.floor(el.input / 60);
//   //               const currentMinutes = el.input % 60;

//   //               if (type === "hours") {
//   //                 const newHours = parseInt(value) || 0;
//   //                 if (newHours >= 0 && newHours <= 24) {
//   //                   if (newHours === 24) {
//   //                     newInput = 24 * 60;
//   //                   } else {
//   //                     newInput = newHours * 60 + currentMinutes;
//   //                   }
//   //                 }
//   //               } else if (type === "minutes") {
//   //                 const newMinutes = parseInt(value) || 0;
//   //                 if (newMinutes >= 0 && newMinutes <= 59) {
//   //                   if (currentHours === 24) {
//   //                     newInput = 24 * 60;
//   //                   } else {
//   //                     newInput = currentHours * 60 + newMinutes;
//   //                   }
//   //                 }
//   //               }

//   //               return { ...el, input: newInput };
//   //             }
//   //             return item.type === "one" ? { ...el, input: 0 } : el;
//   //           }),
//   //         };
//   //       }
//   //       return item;
//   //     })
//   //   );
//   // }

//   function toggleDurationHandler(index, InnerIndex) {
//     setInputs((prevState) =>
//       prevState.map((item, i) =>
//         i === index
//           ? {
//               ...item,
//               inputs: item.inputs.map((el, innerI) =>
//                 innerI === InnerIndex
//                   ? { ...el, selected: !el.selected }
//                   : { ...el, selected: !el.selected }
//               ),
//             }
//           : item
//       )
//     );
//   }

//   function timeChangeHandler(value, index, innerIndex, type) {
//     setInputs((prevState) =>
//       prevState.map((item, i) =>
//         i === index
//           ? {
//               ...item,
//               inputs: item.inputs.map((el, innerI) =>
//                 innerI === innerIndex
//                   ? type === "exact"
//                     ? { ...el, input: value }
//                     : type === "start"
//                     ? { ...el, startinput: value }
//                     : { ...el, endinput: value }
//                   : el
//               ),
//             }
//           : item
//       )
//     );
//   }

//   function renderInputContent(el, index, innerIndex, prevInput) {
//     switch (el.type) {
//       case "durationToggle":
//         return (
//           <div className={classes.durationHandlerContainer}>
//             <div className={classes.durationToggleConatiner}>
//               <label className={classes.switch}>
//                 <input
//                   type="checkbox"
//                   checked={el.selected}
//                   onChange={() => {
//                     toggleDurationHandler(index, innerIndex);
//                   }}
//                 />
//                 <span className={classes.slider}></span>
//               </label>
//               <p className={classes.InputName}>{el.name}</p>
//             </div>
//             {/* <div className={classes.descriptionContainer}>
//               <p>{el.description}</p>
//             </div> */}
//             {el.selected && (
//               <>
//                 {/* <div className={classes.duarationMainConatiner}>
//                   <div className={classes.inputoutermain}>
//                     <label className={classes.label}>Hours</label>
//                     <div className={classes.Input}>
//                       <input
//                         type={el.inputType}
//                         placeholder="hh"
//                         name={el.name}
//                         onChange={(event) => {
//                           const value = event.target.value;
//                           durationChangeHandler(
//                             value,
//                             index,
//                             innerIndex,
//                             "hours"
//                           );
//                         }}
//                         value={Math.floor(el.input / 60)}
//                         min="0"
//                         max="24"
//                         required
//                       />
//                     </div>
//                   </div>
//                   <div className={classes.inputoutermain}>
//                     <label className={classes.label}>Minutes</label>
//                     <div className={classes.Input}>
//                       <input
//                         type={el.inputType}
//                         placeholder="mm"
//                         name={el.name}
//                         onChange={(event) => {
//                           const value = event.target.value;
//                           durationChangeHandler(
//                             value,
//                             index,
//                             innerIndex,
//                             "minutes"
//                           );
//                         }}
//                         value={el.input % 60}
//                         min="0"
//                         max="59"
//                         required
//                       />
//                     </div>
//                   </div>
//                 </div> */}
//                 <DurationInput
//                 description={el.description}
//                   initialValue={el.input}
//                   classes={classes}
//                   onChange={(totalMinutes) => {
//                     setInputs((prevState) =>
//                       prevState.map((item, i) => {
//                         if (i === index) {
//                           return {
//                             ...item,
//                             inputs: item.inputs.map((el, innerI) => {
//                               if (innerI === innerIndex) {
//                                 return { ...el, input: totalMinutes };
//                               }
//                               return item.type === "one"
//                                 ? { ...el, input: 0 }
//                                 : el;
//                             }),
//                           };
//                         }
//                         return item;
//                       })
//                     );
//                   }}
//                 />
//                 {el.subDescription && (
//                   <p className={classes.subDescription}>{el.subDescription}</p>
//                 )}
//               </>
//             )}
//           </div>
//         );

//       case "time":
//         return (
//           <>
//             {prevInput.selected && (
//               <div className={classes.durationHandlerContainer}>
//                 <p className={classes.InputName}>{el.name}</p>
//                 <div className={classes.descriptionContainer}>
//                   <p>{el.description}</p>
//                 </div>
//                 <div className={classes.duarationMainConatiner}>
//                   <div className={classes.inputoutermain}>
//                     {/* <label className={classes.label}>{el.name}</label>*/}
//                     <label className={classes.label}>Start Time</label>
//                     <div className={classes.Input}>
//                       <input
//                         type="time"
//                         value={el.input}
//                         onChange={(e) =>
//                           timeChangeHandler(
//                             e.target.value,
//                             index,
//                             innerIndex,
//                             "exact"
//                           )
//                         }
//                         min="00:00"
//                         max="23:59"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </>
//         );
//       case "timePeriod":
//         return (
//           <>
//             {prevInput.selected && (
//               <div className={classes.durationHandlerContainer}>
//                 <p className={classes.InputName}>{el.name}</p>
//                 <div className={classes.descriptionContainer}>
//                   <p>{el.description}</p>
//                 </div>
//                 <div className={classes.duarationMainConatiner}>
//                   <div className={classes.inputoutermain}>
//                     <label className={classes.label}>Start Time</label>
//                     <div className={classes.Input}>
//                       <input
//                         type="time"
//                         value={el.startinput}
//                         onChange={(e) =>
//                           timeChangeHandler(
//                             e.target.value,
//                             index,
//                             innerIndex,
//                             "start"
//                           )
//                         }
//                         min="00:00"
//                         max="23:59"
//                       />
//                     </div>
//                   </div>
//                   <div className={classes.inputoutermain}>
//                     <label className={classes.label}>End Time</label>
//                     <div className={classes.Input}>
//                       <input
//                         type="time"
//                         value={el.endinput}
//                         onChange={(e) =>
//                           timeChangeHandler(
//                             e.target.value,
//                             index,
//                             innerIndex,
//                             "end"
//                           )
//                         }
//                         min="00:00"
//                         max="23:59"
//                       />
//                     </div>
//                   </div>
//                 </div>
//                 {el.description && (
//                   <p className={classes.finalSubDescription}>
//                     {el.subDescription}
//                   </p>
//                 )}
//               </div>
//             )}
//           </>
//         );
//       default:
//         return <p>Unknown input type</p>;
//     }
//   }

//   return (
//     <div className={classes.main}>
//       <div className={classes.inputsContainer}>
//         {inputs.map((el, index) => (
//           <div className={classes.inputsBtnContainer} key={index}>
//             <button
//               className={`${classes.Inputbutton} ${
//                 inputsShowList.includes(index) ? classes.opened : ""
//               }`}
//               onClick={() => showDivHandler(index)}
//             >
//               <div className={classes.chevronCont}>
//                 <RightChevron
//                   class={inputsShowList.includes(index) ? "rotate" : ""}
//                 />
//               </div>
//               <p>{el.name}</p>
//             </button>
//             {inputsShowList.includes(index) && (
//               <div className={classes.hiddendiv}>
//                 {el.inputs.map((input, innerIndex) => (
//                   <div key={innerIndex}>
//                     <div className={classes.hiddenDivInnerMain}>
//                       {/* <p className={classes.InputName}>{input.name}</p>
//                       <div className={classes.descriptionContainer}>
//                         <p>{input.description}</p>
//                       </div> */}
//                       {renderInputContent(
//                         input,
//                         index,
//                         innerIndex,
//                         inputs[0].inputs[innerIndex]
//                       )}
//                       {/* {input.subDescription && (
//                         <p className={classes.subDescription}>
//                           {input.subDescription}
//                         </p>
//                       )} */}
//                     </div>
//                     {el.type === "one" && el.inputs.length > innerIndex + 1 && (
//                       <p className={classes.or}>or</p>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         ))}
//       </div>
//       <GreyButton handler={nextHandler}>Next</GreyButton>
//     </div>
//   );
// }

// export default Schedule;

import React, { useEffect, useState } from "react";
import classes from "./Schedule.module.css";
import GreyButton from "../../Buttons/GreyButton";
import RightChevron from "../../../assets/Icons/RightChevron";
import { failToast, schedulingInputsValidater, successToast } from "../../../Utils/utils";
import SchedulesInput from "./../../Inputs/SchedulesInput/SchedulesInput";
import DurationInput from "./DurationInput";
import TimeInput from "../../Inputs/SchedulesInput/TimeInput";

function Schedule(props) {
  const [inputs, setInputs] = useState(props.schedules || []);
  const [inputsShowList, setInputsShowList] = useState([]);

  useEffect(() => {
    props.setScheduleHandler(inputs);
  }, [inputs]);

  function validateInputs() {
    const selectedSchedule = inputs.inputs.find((el) => el.selected);
    if (selectedSchedule) {
      return schedulingInputsValidater(selectedSchedule);
    }
  failToast("Please set correct Scheduling Inputs");
    return false; 
  }

  function nextHandler() {
    if (validateInputs()) {
      successToast("Schedules saved");
      props.nextHandler("Save");
    }
  }

  const showDivHandler = (index) => {
    if (inputsShowList.includes(index)) {
      setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
    } else {
      setInputsShowList((prevstate) => [...prevstate, index]);
    }
  };
  function toggleHandler(index) {
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index
            ? { ...item, selected: true }
            : { ...item, selected: false }
        ),
      };
    });
  }
  function SetDurationHandler(duration, index) {
    console.log("Entered SetDurationHandler");
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index ? { ...item, durationInput: duration } : item
        ),
      };
    });
  }

  function timeChangeHandler(value, index, type) {
    console.log("Entered timeChangeHandler");
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((el, i) =>
          i === index
            ? type === "exact"
              ? { ...el, timeInput: value }
              : type === "start"
              ? { ...el, startinput: value }
              : { ...el, endinput: value }
            : el
        ),
      };
    });
  }

  function renderInputContent(el, index) {
    switch (el.type) {
      case "DurationWithExactStartTime":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <>
                <DurationInput
                  description={el.firstInputdescription}
                  initialValue={el.durationInput}
                  classes={classes}
                  onChange={(totalMinutes) => {
                    SetDurationHandler(totalMinutes, index);
                  }}
                />
                <div className={classes.durationHandlerContainer}>
                <p className={classes.InputName}>{el.SecondHeading}</p>
                <p className={classes.InputName}>{el.secondInputName}</p>
                <div className={classes.descriptionContainer}>
                  <p>{el.secondInputdescription}</p>
                </div>
                <div className={classes.duarationMainConatiner}>
                <TimeInput
                  value={el.timeInput}
                  lable={"Start Time"}
                  timeChangeHandler={(value) => {
                    timeChangeHandler(value, index, "exact");
                  }}
                />
                </div>
              </div>
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      case "DurationWithTimeWindow":
        return (
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <>
                <DurationInput
                  description={el.firstInputdescription}
                  initialValue={el.durationInput}
                  classes={classes}
                  onChange={(totalMinutes) => {
                    SetDurationHandler(totalMinutes, index);
                  }}
                />
                <div className={classes.durationHandlerContainer}>
                  <p className={classes.InputName}>{el.SecondHeading}</p>
                  <p className={classes.InputName}>{el.secondInputName}</p>
                  <div className={classes.descriptionContainer}>
                    <p>{el.secondInputdescription}</p>
                  </div>
                  <div className={classes.duarationMainConatiner}>
                  <TimeInput
                  value={el.startinput}
                  lable={"Start Time"}
                  timeChangeHandler={(value) => {
                    timeChangeHandler(value, index, "start");
                  }}
                />
                <TimeInput
                  value={el.endinput}
                  lable={"End Time"}
                  timeChangeHandler={(value) => {
                    timeChangeHandler(value, index, "end");
                  }}
                />
                  </div>
                </div>
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      case "ExactStartTime":
        return(
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <div className={classes.fixedStartTimeHandler}>
              <div className={classes.descriptionContainer}>
              <p>{el.firstInputdescription}</p>
            </div>
              <TimeInput
              value={el.timeInput}
              lable={"Start Time"}
              timeChangeHandler={(value) => {
                timeChangeHandler(value, index, "exact");
              }}
            />
            </div>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        ); 
      case "EveryDayAutomaticRun":
        return(
          <div className={classes.durationHandlerContainer}>
            <div className={classes.durationToggleConatiner}>
              <label className={classes.switch}>
                <input
                  type="checkbox"
                  checked={el.selected}
                  onChange={() => {
                    toggleHandler(index);
                  }}
                />
                <span className={classes.slider}></span>
              </label>
              <p className={classes.InputName}>{el.firstInputname}</p>
            </div>
            {el.selected && (
              <>
                <div className={classes.fixedStartTimeHandler}>
                  <div className={classes.descriptionContainer}>
                    <p>{el.firstInputdescription}</p>
                  </div>
                  <div className={classes.duarationMainConatiner}>
                  <TimeInput
                  value={el.startinput}
                  lable={"Start Time"}
                  timeChangeHandler={(value) => {
                    timeChangeHandler(value, index, "start");
                  }}
                />
                <TimeInput
                  value={el.endinput}
                  lable={"End Time"}
                  timeChangeHandler={(value) => {
                    timeChangeHandler(value, index, "end");
                  }}
                />
                  </div>
                </div>
              </>
            )}
            {el.firstInputSubDescription && (
              <p className={classes.subDescription}>
                {el.firstInputSubDescription}
              </p>
            )}
          </div>
        );
      default:
        return <p>Unknown input type</p>;
    }
  }

  return (
    <div className={classes.main}>
      <div className={classes.inputsContainer}>
        {inputs.inputs.map((el, index) => (
          <div className={classes.inputsBtnContainer} key={index}>
            <button
              className={`${classes.Inputbutton} ${
                inputsShowList.includes(index) ? classes.opened : ""
              }`}
              onClick={() => showDivHandler(index)}
            >
              <div className={classes.chevronCont}>
                <RightChevron
                  class={inputsShowList.includes(index) ? "rotate" : ""}
                />
              </div>
              <p>{el.Heading}</p>
            </button>
            {inputsShowList.includes(index) && (
              <div className={classes.hiddendiv}>
                {
                  <div className={classes.hiddenDivInnerMain}>
                    {renderInputContent(el, index)}
                  </div>
                }
              </div>
            )}
          </div>
        ))}
      </div>
      <GreyButton handler={nextHandler}>Next</GreyButton>
    </div>
  );
}

export default Schedule;
