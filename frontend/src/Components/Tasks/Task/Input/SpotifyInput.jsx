// import classes from "./SpotifyInput.module.css";
// import ToggleInput from "../../../Inputs/ToggleInput";
// import InputText from "../../../Inputs/InputText";
// import Cross from "../../../../assets/svgs/Cross";

// function SpotifyInput({ 
//   input,
//   groupIndex,
//   innerIndex,
//   groupInputs,
//   inputsToggleChangeHandler, 
//   inputTextChangeHandler 
// }) {

//   // Check if this field should be shown (conditional logic)
//   const shouldShow = !input.conditionalOn || 
//     groupInputs.find(inp => inp.name === input.conditionalOn)?.input === true;

//   if (!shouldShow) return null;

//   function renderSpotifyInputContent() {
//     switch (input.type) {
//       case "toggle":
//         return (
//           <ToggleInput
//             el={input}
//             inputsToggleChangeHandler={inputsToggleChangeHandler}
//             index={groupIndex}
//             InnerIndex={innerIndex}
//           />
//         );

//       case "spotifySongInput":
//         return (
//           <InputText
//             label="Enter Song Name:"
//             type="text"
//             placeholder="E.g., Shape of You"
//             name="input"
//             handler={(val) =>
//               inputTextChangeHandler(groupIndex, innerIndex, val, "input")
//             }
//             isTaskInputs={true}
//             value={input.input}
//           />
//         );

//       case "text":
//         return (
//           <InputText
//             label={input.name + ":"}
//             type="text"
//             placeholder={input.placeholder || ""}
//             name="input"
//             handler={(val) =>
//               inputTextChangeHandler(groupIndex, innerIndex, val, "input")
//             }
//             isTaskInputs={true}
//             value={input.input}
//           />
//         );

//       case "dynamicList":
//         return (
//           <div className={classes.dynamicListContainer}>
//             <div className={classes.dynamicListHeader}>
//               <label>{input.name}:</label>
//               <p className={classes.description}>{input.description}</p>
//             </div>
            
//             <div className={classes.songsListContainer}>
//               {input.input && input.input.length > 0 ? (
//                 input.input.map((song, songIndex) => (
//                   <div key={songIndex} className={classes.songInputRow}>
//                     <InputText
//                       label={`Song ${songIndex + 1}:`}
//                       type="text"
//                       placeholder={input.placeholder || "Enter song name"}
//                       name={`song_${songIndex}`}
//                       handler={(val) => {
//                         const updatedSongs = [...input.input];
//                         updatedSongs[songIndex] = val;
//                         inputTextChangeHandler(groupIndex, innerIndex, updatedSongs, "input");
//                       }}
//                       isTaskInputs={true}
//                       value={song}
//                     />
//                     {input.input.length > (input.minItems || 1) && (
//                       <button
//                         className={classes.removeSongBtn}
//                         onClick={() => {
//                           const updatedSongs = input.input.filter((_, i) => i !== songIndex);
//                           inputTextChangeHandler(groupIndex, innerIndex, updatedSongs, "input");
//                         }}
//                         aria-label="Remove song"
//                       >
//                         <Cross />
//                       </button>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className={classes.songInputRow}>
//                   <InputText
//                     label="Song 1:"
//                     type="text"
//                     placeholder={input.placeholder || "Enter song name"}
//                     name="song_0"
//                     handler={(val) => {
//                       inputTextChangeHandler(groupIndex, innerIndex, [val], "input");
//                     }}
//                     isTaskInputs={true}
//                     value=""
//                   />
//                 </div>
//               )}
              
//               {(!input.maxItems || (input.input && input.input.length < input.maxItems)) && (
//                 <button
//                   className={classes.addSongBtn}
//                   onClick={() => {
//                     const currentSongs = input.input || [];
//                     const updatedSongs = [...currentSongs, ""];
//                     inputTextChangeHandler(groupIndex, innerIndex, updatedSongs, "input");
//                   }}
//                 >
//                   + Add Song
//                 </button>
//               )}
//             </div>
//           </div>
//         );

//       default:
//         return <p>Unknown Spotify input type: {input.type}</p>;
//     }
//   }

//   return (
//     <div className={classes.inputWrapper}>
//       <div className={classes.descriptionContainer}>
//         <p>{input.description}</p>
//       </div>
//       <div className={classes.inputCont}>
//         {renderSpotifyInputContent()}
//       </div>
//     </div>
//   );
// }

// export default SpotifyInput;