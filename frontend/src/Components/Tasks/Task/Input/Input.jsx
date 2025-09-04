import RightChevron from "../../../../assets/Icons/RightChevron";
import GreyButton from "../../../Buttons/GreyButton";
import classes from "./Input.module.css";
import { useEffect, useState } from "react";
import { successToast, failToast } from "../../../../Utils/utils";
import { Table } from "lucide-react";
import CompleteOverlay from "../../../Overlay/CompleteOverlay";
import UserinteractionTable from "../../../Tables/userInteracTable/UserinteractionTable";
import BlueButton from "../../../Buttons/BlueButton";
import KeywordInput from "../../../Inputs/PositiveandNegativekeywordInput";
import ToggleInput from "../../../Inputs/ToggleInput";
import InputText from "../../../Inputs/InputText";
import DurationInput from "../../Schedule/DurationInput";
import NumberInput from "../../Schedule/NumberInput";
import LinkButton from "../../../Links/LinkButton";
import InputWithButton from "../../../Inputs/InputWithButton";
import RadioOptions from "../RadioOptions";
import Cross from "../../../../assets/svgs/Cross";
import CustomChevronUp from "../../../../assets/svgs/ChevronUp";
import CustomChevronDown from "../../../../assets/svgs/ChevronDown";

function Input(props) {
  const [inputs, setInputs] = useState(props.inputs ? props.inputs : null);
  const [inputsShowList, setInputsShowList] = useState([]);
  const [openItems, setOpenItems] = useState([])
  const toggleAccordion = (value) => {
    setOpenItems((prev) => (prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]))
  }
  const [showUserInteractionTable, setshowUserInteractionTable] =
    useState(false);

  useEffect(() => {
    props.setInputsHandler(inputs);
  }, [inputs]);

  const NextHandler = async () => {
    // Validate minSleepTime and maxSleepTime
    let isValid = true;

    inputs.inputs.forEach((item) => {
      item.inputs.forEach((input) => {
        if (input.type === "toggleKeywordsAndGap" && input.input) {
          const { minSleepTime, maxSleepTime } = input;

          if (
            (minSleepTime > 0 || maxSleepTime > 0) &&
            (minSleepTime === 0 || maxSleepTime === 0)
          ) {
            failToast("Please set both Min and Max Sleep Time.");
            isValid = false;
          } else if (minSleepTime > maxSleepTime) {
            failToast("Min Sleep Time should be smaller than Max Sleep Time.");
            isValid = false;
          }
        }
      });
    });

    if (!isValid) return;

    successToast("Inputs saved");
    props.nextHandler("Choose device");
  };

  const showDivHandler = (index) => {
    if (inputsShowList.includes(index)) {
      setInputsShowList((prevstate) => prevstate.filter((el) => el !== index));
    } else {
      setInputsShowList((prevstate) => [...prevstate, index]);
    }
  };

  const showTableHanler = () => {
    setshowUserInteractionTable(true);
  };

  const hideFormHandler = () => {
    setshowUserInteractionTable(false);
  };

  function inputsToggleChangeHandler(index, InnerIndex) {
    setInputs((prevState) => {
      if (prevState.type === "one") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el) => {
                    return { ...el, input: !el.input };
                  }),
                }
              : {
                  ...item,
                  inputs: item.inputs.map((el) => {
                    return { ...el, input: false };
                  }),
                }
          ),
        };
      } else {
        if (prevState.inputs[0].name === "Following Automation Type") {
          return {
            ...prevState,
            inputs: prevState.inputs.map((item, i) => ({
              ...item,
              inputs: item.inputs.map((input, inputIndex) => ({
                ...input,
                Accounts: input.Accounts.map((account, accountIndex) =>
                  accountIndex === index
                    ? {
                        ...account,
                        inputs: account.inputs.map(
                          (accountInputs, accountInputIndex) =>
                            accountInputIndex === InnerIndex
                              ? { ...accountInputs, input: true }
                              : { ...accountInputs, input: false }
                        ),
                      }
                    : account
                ),
              })),
            })),
          };
        } else {
          return {
            ...prevState,
            inputs: prevState.inputs.map((item, i) =>
              i === index
                ? {
                    ...item,
                    inputs: item.inputs.map((el, innerI) =>
                      innerI === InnerIndex
                        ? { ...el, input: !el.input }
                        : item.type === "one"
                        ? { ...el, input: false }
                        : el
                    ),
                  }
                : item
            ),
          };
        }
      }
    });
  }

  function inputTextChangeHandler(index, InnerIndex, val, type) {
    setInputs((prevState) => {
      if (prevState.inputs[0].name === "Following Automation Type") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) => ({
            ...item,
            inputs: item.inputs.map((input, inputIndex) => ({
              ...input,
              Accounts: input.Accounts.map((account, accountIndex) =>
                accountIndex === index
                  ? {
                      ...account,
                      inputs: account.inputs.map(
                        (accountInputs, accountInputIndex) =>
                          accountInputIndex === InnerIndex
                        ? { ...accountInputs, [type]: val }
                        : accountInputs
                      ),
                    }
                  : account
              ),
            })),
          })),
        };
      } else {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index
            ? {
                ...item,
                inputs: item.inputs.map((el, innerI) =>
                  innerI === InnerIndex ? { ...el, [type]: val } : el
                ),
              }
            : item
        ),
      };
    }
    });
  }

  const AddkeywordHandler = (index, InnerIndex, val, type) => {
    setInputs((prevState) => {
      if (prevState.inputs[0].name === "Following Automation Type") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) => ({
            ...item,
            inputs: item.inputs.map((input, inputIndex) => ({
              ...input,
              Accounts: input.Accounts.map((account, accountIndex) =>
                accountIndex === index
                  ? {
                      ...account,
                      inputs: account.inputs.map(
                        (accountInputs, accountInputIndex) =>
                          accountInputIndex === InnerIndex
                        ? { ...accountInputs, [type]: [...accountInputs[type], val] }
                        : accountInputs
                      ),
                    }
                  : account
              ),
            })),
          })),
        };
      } else {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) =>
            i === index
              ? {
                  ...item,
                  inputs: item.inputs.map((el, innerI) =>
                    innerI === InnerIndex
                      ? { ...el, [type]: [...el[type], val] }
                      : el
                  ),
                }
              : item
          ),
        };
      }
    });
  };

  const removeKeywordHandler = (index, InnerIndex, val, type) => {
    setInputs((prevState) => {
      if (prevState.inputs[0].name === "Following Automation Type") {
        return {
          ...prevState,
          inputs: prevState.inputs.map((item, i) => ({
            ...item,
            inputs: item.inputs.map((input, inputIndex) => ({
              ...input,
              Accounts: input.Accounts.map((account, accountIndex) =>
                accountIndex === index
                  ? {
                      ...account,
                      inputs: account.inputs.map(
                        (accountInputs, accountInputIndex) =>
                          accountInputIndex === InnerIndex
                        ? {
                          ...accountInputs,
                          [type]: Array.isArray(accountInputs[type])
                            ? accountInputs[type].filter((keyword) => keyword !== val)
                            : [],
                        }
                      : accountInputs
                      ),
                    }
                  : account
              ),
            })),
          })),
        };
      } else {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index
            ? {
                ...item,
                inputs: item.inputs.map((el, innerI) =>
                  innerI === InnerIndex
                    ? {
                        ...el,
                        [type]: Array.isArray(el[type])
                          ? el[type].filter((keyword) => keyword !== val)
                          : [],
                      }
                    : el
                ),
              }
            : item
        ),
      };
    }
    });
  };

  const AddAccountHandler = (index, InnerIndex, val, type) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          i === index
            ? {
                ...item,
                inputs: item.inputs.map((el, innerI) =>
                  innerI === InnerIndex
                    ? {
                        ...el,
                        [type]: [
                          ...el[type],
                          { username: val, inputs: el.ActualInputs },
                        ],
                      }
                    : el
                ),
              }
            : item
        ),
      };
    });
  };
  const RemoveAccountHandler = (accountIndex) => {
    setInputs((prevState) => {
      return {
        ...prevState,
        inputs: prevState.inputs.map((item, i) =>
          ({
                ...item,
                inputs: item.inputs.map((el, innerI) =>
                    ({
                        ...el,
                        Accounts: el.Accounts.filter((Account, index) => {
                          return index !== accountIndex;
                        }),
                      })
                ),
              })
        ),
      };
    });
  };

  function renderInputContent(el, index, InnerIndex) {
    switch (el.type) {
      case "toggle":
        return (
          <>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
          </>
        );
      case "input":
        return (
          <>
            <input type="checkbox" />
            <label>
              <span>Toggle Input</span>
            </label>
          </>
        );
      case "toggleWithKeywords":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <KeywordInput
                  inputs={[
                    { label: "Positive Keywords:", array: "positiveKeywords" },
                    { label: "Negative Keywords:", array: "negativeKeywords" },
                  ]}
                  el={el}
                  AddkeywordHandler={AddkeywordHandler}
                  removeKeywordHandler={removeKeywordHandler}
                  index={index}
                  InnerIndex={InnerIndex}
                />
                <div>
                  <NumberInput
                    description={
                      "Enter the number of mutual friends a profile should have to be followed."
                    }
                    onChange={(value) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "mutualFriendsCount"
                      );
                    }}
                    min={el.minMutualFriendsValue}
                    Value={el.mutualFriendsCount}
                  />
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Per Hour:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsPerHour"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsPerHour}
                    />
                    <NumberInput
                      lable={"Max Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsPerHour"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsPerHour}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Daily:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsDaily"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsDaily}
                    />
                    <NumberInput
                      lable={"Max Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsDaily"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsDaily}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Sleep Time of Bot after
                      performing automation on each Account:
                    </p>
                  </div>
                  <div className={classes.minMaxTimeInputsContainer}>
                    <DurationInput
                      InnerHeading={"Min sleep Time:"}
                      initialValue={el.minSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "minSleepTime"
                        );
                      }}
                    />
                    <DurationInput
                      InnerHeading={"Max sleep Time:"}
                      initialValue={el.maxSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "maxSleepTime"
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "toggleUrlAndKeyword":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <InputText
                  label={"Profile Url:"}
                  type={"text"}
                  placeholder={"Profile Url"}
                  name={"profileurl"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "url");
                  }}
                  isTaskInputs={true}
                  value={el.url}
                />
                <KeywordInput
                  inputs={[
                    { label: "Positive Keywords:", array: "positiveKeywords" },
                    { label: "Negative Keywords:", array: "negativeKeywords" },
                  ]}
                  el={el}
                  AddkeywordHandler={AddkeywordHandler}
                  removeKeywordHandler={removeKeywordHandler}
                  index={index}
                  InnerIndex={InnerIndex}
                />
                <div>
                  <NumberInput
                    description={
                      "Enter the number of mutual friends a profile should have to be followed."
                    }
                    onChange={(value) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        value,
                        "mutualFriendsCount"
                      );
                    }}
                    min={el.minMutualFriendsValue}
                    Value={el.mutualFriendsCount}
                  />
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Per Hour:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsPerHour"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsPerHour}
                    />
                    <NumberInput
                      lable={"Max Follows Per Hour:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsPerHour"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsPerHour}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Follows Bot should Perform
                      Daily:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsDaily"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsDaily}
                    />
                    <NumberInput
                      lable={"Max Follows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsDaily"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsDaily}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Sleep Time of Bot after
                      performing automation on each Account:
                    </p>
                  </div>
                  <div className={classes.minMaxTimeInputsContainer}>
                    <DurationInput
                      InnerHeading={"Min sleep Time:"}
                      initialValue={el.minSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "minSleepTime"
                        );
                      }}
                    />
                    <DurationInput
                      InnerHeading={"Max sleep Time:"}
                      initialValue={el.maxSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "maxSleepTime"
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "toggleAndUnFollowInputs":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <>
                <div className={classes.minMaxInputsOuterContainer}>
                  <RadioOptions
                    options={["Default", "Earliest"]}
                    initialValue={el.typeOfUnfollowing}
                    description={"Please Select the Followers List Sort Type:"}
                    handler={(val) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        val,
                        "typeOfUnfollowing"
                      );
                    }}
                  />
                  <KeywordInput
                    inputs={[
                      {
                        label: "Enter Any Profiles Username to exclude:",
                        array: "usersToExcludeList",
                      },
                    ]}
                    el={el}
                    AddkeywordHandler={AddkeywordHandler}
                    removeKeywordHandler={removeKeywordHandler}
                    index={index}
                    InnerIndex={InnerIndex}
                  />
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum UnFollows Bot should Perform
                      Per Run:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min UnFollows Per Run:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsPerHour"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsPerHour}
                    />
                    <NumberInput
                      lable={"Max UnFollows Per Run:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsPerHour"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsPerHour}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum UnFollows Bot should Perform
                      Daily:
                    </p>
                  </div>
                  <div className={classes.minMaxInputsContainer}>
                    {" "}
                    <NumberInput
                      lable={"Min UnFollows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "minFollowsDaily"
                        );
                      }}
                      min={1}
                      Value={el.minFollowsDaily}
                    />
                    <NumberInput
                      lable={"Max UnFollows Daily:"}
                      onChange={(value) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          value,
                          "maxFollowsDaily"
                        );
                      }}
                      min={2}
                      Value={el.maxFollowsDaily}
                    />
                  </div>
                </div>
                <div className={classes.minMaxInputsOuterContainer}>
                  <div>
                    <p>
                      Enter the Maximum and Minimum Sleep Time of Bot after
                      performing automation on each Account:
                    </p>
                  </div>
                  <div className={classes.minMaxTimeInputsContainer}>
                    <DurationInput
                      InnerHeading={"Min sleep Time:"}
                      initialValue={el.minSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "minSleepTime"
                        );
                      }}
                    />
                    <DurationInput
                      InnerHeading={"Max sleep Time:"}
                      initialValue={el.maxSleepTime}
                      onChange={(totalMinutes) => {
                        inputTextChangeHandler(
                          index,
                          InnerIndex,
                          totalMinutes,
                          "maxSleepTime"
                        );
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case "toggleKeywordsAndGap":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <div>
                <KeywordInput
                  inputs={[
                    {
                      label:
                        "Enter profile usernames to exclude from automation:",
                      array: "usernamesToExclude",
                    },
                  ]}
                  el={el}
                  AddkeywordHandler={AddkeywordHandler}
                  removeKeywordHandler={removeKeywordHandler}
                  index={index}
                  InnerIndex={InnerIndex}
                />
              </div>
            )}
          </div>
        );
      case "toggleAndGap":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <div className={classes.minMaxInputsOuterContainer}>
                <div>
                  <p>
                    Enter the Maximum and Minimum Sleep Time of Bot after
                    performing automation on each Account:
                  </p>
                </div>
                <div className={classes.minMaxTimeInputsContainer}>
                  <DurationInput
                    InnerHeading={"Min sleep Time:"}
                    initialValue={el.minSleepTime}
                    onChange={(totalMinutes) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        totalMinutes,
                        "minSleepTime"
                      );
                    }}
                  />
                  <DurationInput
                    InnerHeading={"Max sleep Time:"}
                    initialValue={el.maxSleepTime}
                    onChange={(totalMinutes) => {
                      inputTextChangeHandler(
                        index,
                        InnerIndex,
                        totalMinutes,
                        "maxSleepTime"
                      );
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        );
      case "toggleDiscordAnalysis":
        return (
          <div className={classes.Inputscontainer}>
            <ToggleInput
              el={el}
              inputsToggleChangeHandler={inputsToggleChangeHandler}
              index={index}
              InnerIndex={InnerIndex}
            />
            {el.input && (
              <div className={classes.analysisInputConatainer}>
                <div>
                  <p className={classes.discordInviteContainer}>
                    Add Appilot bot to your server by clicking the button:{" "}
                    <LinkButton
                      link={
                        "https://discord.com/oauth2/authorize?client_id=1326626975284072550&permissions=274877917184&integration_type=0&scope=bot"
                      }
                      text={"Appilot Bot"}
                    />
                  </p>
                </div>
                <InputText
                  label={"Please provide your Server Id:"}
                  type={"text"}
                  placeholder={""}
                  name={"serverId"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "serverId");
                  }}
                  isTaskInputs={true}
                />
                <InputText
                  label={"Please provide your Channel Id:"}
                  type={"text"}
                  placeholder={""}
                  name={"channelId"}
                  handler={(val) => {
                    inputTextChangeHandler(index, InnerIndex, val, "channelId");
                  }}
                  isTaskInputs={true}
                />
              </div>
            )}
          </div>
        );
      case "instagrmFollowerBotAcountWise":
        return (
          <div className={classes.Inputscontainer}>
            <div className={classes.addbuttonInputContainer}>
              <InputWithButton
                lable={"Enter profile usernames to perform automation:"}
                type="text"
                name={"accountUsername"}
                buttonText="Add"
                handler={(value) => {
                  if (value.trim() === "") {
                    failToast("Please enter username");
                    return;
                  } else {
                    AddAccountHandler(index, InnerIndex, value, "Accounts");
                    console.log("Inputs after adding account name", inputs);
                  }
                }}
              />
            </div>
            {el.Accounts.length !== 0 && (
              <>
                {el.Accounts.map((account, accountIndex) => {
                  const isOpen = openItems.includes(accountIndex);
                  return (
                    <div className={classes.accountContainer} key={accountIndex}>
                      <div className={classes.accountHeaderContainer}>
                        <h6 className={classes.accountUsername}>{account.username}</h6>
                        <div className={classes.accountActions}>
                          <button
                            className={classes.removeAccountBtn}
                            onClick={() => RemoveAccountHandler(accountIndex)}
                            aria-label="Remove account"
                          >
                            <Cross />
                          </button>
                          <button
                            className={`${classes.accordionButton} ${isOpen ? classes.opened : ""}`}
                            onClick={() => toggleAccordion(accountIndex)}
                            aria-label={isOpen ? "Collapse" : "Expand"}
                          >
                            {isOpen ? <CustomChevronUp /> : <CustomChevronDown />}
                          </button>
                        </div>
                      </div>
                      {isOpen && (
                        <div className={classes.accordionContent}>
                          <p className={classes.setInputsHeading}>Please set Inputs for this account:</p>
                          {account.inputs.map((input, inputIndex) => (
                            <div key={inputIndex} className={classes.inputWrapper}>
                              <div className={classes.descriptionContainer}>
                                <p>{input.description}</p>
                              </div>
                              <div className={classes.inputCont}>{renderInputContent(input, accountIndex, inputIndex)}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        );
      // case "spotifySongInput":
      //     return (
      //    <InputText
      //   label={el.name + ":"}
      //   type="text"
      //   placeholder={el.placeholder || "Enter song name"}
      //   name="input"
      //   handler={(val) =>
      //     inputTextChangeHandler(index, InnerIndex, val, "input")
      //   }
      //   isTaskInputs={true}
      //   value={el.input}
      //    />
      //     );
      case "number":
          return (
         <NumberInput
        // label={el.name + ":"}
        // description={el.description}
        onChange={(val) =>
          inputTextChangeHandler(index, InnerIndex, val, "input")
        }
        min={el.min}
        max={el.max}
        value={el.input}
         />
          );
      case "dynamicSessionArray":
          // Constraint: sum of all clones should not be more than 15
          // Constraint: sum of all session durations should not exceed 24 hours
          const maxClones = 15;
          const maxTotalMinutes = 24 * 60;
          const sessionCount = inputs.inputs[index].inputs.find(i => i.name === "Number of Sessions")?.input || 0;
          const currentClonesSum = (el.input || []).reduce((sum, s) => sum + (parseInt(s.clones, 10) || 0), 0);
          const currentTotalMinutes = (el.input || []).reduce(
         (sum, s) =>
           sum +
           ((parseInt(s.duration?.hours, 10) || 0) * 60 +
          (parseInt(s.duration?.minutes, 10) || 0)),
         0
          );

          return (
          <div className={classes.dynamicListContainer}>
         <div className={classes.dynamicListHeader}>
         <label>{el.name}:</label>
         {/* <p className={classes.description}>{el.description}</p> */}
         </div>
         <div className={classes.songsListContainer}>
         {Array.from({ length: sessionCount }).map((_, sessionIndex) => {
        const sessionData = el.input?.[sessionIndex] || { duration: { hours: "", minutes: "" }, clones: "" };
        return (
        <div key={sessionIndex} className={classes.songInputRow}>
          <div className={classes.sessionRow}>
          <div className={classes.sessionNumber}>
         Session {sessionIndex + 1}
          </div>
          <div className={classes.durationFields}>
         <div className={classes.inputGroup}>
           <label>Hours:</label>
           <input
          type="number"
          min={0}
          max={24}
          value={sessionData.duration?.hours ?? 0}
          onChange={(e) => {
            const updatedSessions = el.input ? [...el.input] : [];
            let hours = parseInt(e.target.value, 10);
            if (isNaN(hours) || hours < 0) hours = 0;
            if (hours > 24) hours = 24;
            // Calculate new total minutes if this session's hours are changed
            const prevMinutes = (parseInt(sessionData.duration?.hours, 10) || 0) * 60 + (parseInt(sessionData.duration?.minutes, 10) || 0);
            const newMinutes = (hours * 60) + (parseInt(sessionData.duration?.minutes, 10) || 0);
            const otherTotalMinutes = currentTotalMinutes - prevMinutes;
            if (otherTotalMinutes + newMinutes > maxTotalMinutes) {
           failToast(`Total session time for all sessions cannot exceed 24 hours.`);
           return;
            }
            updatedSessions[sessionIndex] = {
           ...sessionData,
           duration: {
             hours: hours,
             minutes: sessionData.duration?.minutes ?? 0
           },
           clones: sessionData.clones ?? ""
            };
            inputTextChangeHandler(index, InnerIndex, updatedSessions, "input");
          }}
           />
         </div>
         <div className={classes.inputGroup}>
           <label>Minutes:</label>
           <input
          type="number"
          min={0}
          max={59}
          value={sessionData.duration?.minutes ?? 0}
          onChange={(e) => {
            const updatedSessions = el.input ? [...el.input] : [];
            let minutes = parseInt(e.target.value, 10);
            if (isNaN(minutes) || minutes < 0) minutes = 0;
            if (minutes > 59) minutes = 59;
            // Calculate new total minutes if this session's minutes are changed
            const prevMinutes = (parseInt(sessionData.duration?.hours, 10) || 0) * 60 + (parseInt(sessionData.duration?.minutes, 10) || 0);
            const newMinutes = (parseInt(sessionData.duration?.hours, 10) || 0) * 60 + minutes;
            const otherTotalMinutes = currentTotalMinutes - prevMinutes;
            if (otherTotalMinutes + newMinutes > maxTotalMinutes) {
           failToast(`Total session time for all sessions cannot exceed 24 hours.`);
           return;
            }
            updatedSessions[sessionIndex] = {
           ...sessionData,
           duration: {
          hours: sessionData.duration?.hours ?? 0,
          minutes: minutes
           },
           clones: sessionData.clones ?? ""
            };
            inputTextChangeHandler(index, InnerIndex, updatedSessions, "input");
          }}
           />
         </div>
          </div>

          <NumberInput
         lable={"Number of Clones:"}
         description={"Set how many clones to use for this session."}
         onChange={(val) => {
           // Calculate new sum if this session's clones are changed
           const prevClones = parseInt(sessionData.clones, 10) || 0;
           const newClones = parseInt(val, 10) || 0;
           const otherClonesSum = currentClonesSum - prevClones;
           if (otherClonesSum + newClones > maxClones) {
          failToast(`Total clones for all sessions cannot exceed ${maxClones}.`);
          return;
           }
           const updatedSessions = el.input ? [...el.input] : [];
           updatedSessions[sessionIndex] = {
          ...sessionData,
          clones: val,
          duration: sessionData.duration ?? { hours: "", minutes: "" }
           };
           inputTextChangeHandler(index, InnerIndex, updatedSessions, "input");
         }}
         min={el.sessionStructure?.clones?.min || 1}
         Value={sessionData.clones ?? ""}
          />
          </div>
        </div>
        );
         })}
         </div>
         {currentClonesSum > maxClones && (
        <div className={classes.errorText}>
          Total clones for all sessions cannot exceed {maxClones}.
        </div>
         )}
         {currentTotalMinutes > maxTotalMinutes && (
        <div className={classes.errorText}>
          Total session time for all sessions cannot exceed 24 hours.
        </div>
         )}
          </div>
          );
      case "text":
               return (
            <InputText
              label={el.name + ":"}
              type="text"
              placeholder={el.placeholder || ""}
              name="input"
              handler={(val) =>
                inputTextChangeHandler(index, InnerIndex, val, "input")
              }
              isTaskInputs={true}
              value={el.input}
            />
          );       
      default:
        return <p>Unknown input type</p>;
    }
  }
  
  return (
    inputs && (
      <div className={classes.main}>
        <div className={classes.inputsContainer}>
          {inputs.inputs.map((el, index) => {
            return (
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
                  <p>{el.name}</p>
                </button>
                {inputsShowList.includes(index) && (
                  <div className={classes.hiddendiv}>
                    {el.inputs.map((input, innerIndex) => {
                      return (
                        <>
                          <div key={innerIndex}>
                            <div className={classes.descriptionContainer}>
                              <p>{input.description}</p>
                            </div>
                            {/* <div className={classes.inputCont}>
                              {(
                                // Only apply conditional logic to Spotify-related groups
                                (el.name === "Spotify Action" || el.name === "Create Playlist") 
                                  ? (!input.conditionalOn || el.inputs.find(inp => inp.name === input.conditionalOn)?.input === true) && renderInputContent(input, index, innerIndex)
                                  : renderInputContent(input, index, innerIndex)
                              )}
                            </div> */}
                            <div className={classes.inputCont}>
                              {renderInputContent(input, index, innerIndex)}
                            </div>
                          </div>
                        </>
                      );
                    })}
                    {el.name.trim() === "User Interaction Speed" && (
                      <p className={classes.tableP}>
                        User Interaction Speed Limits Table{" "}
                        <BlueButton handler={showTableHanler}>
                          <Table /> Table
                        </BlueButton>
                        {showUserInteractionTable && (
                          <CompleteOverlay>
                            <UserinteractionTable
                              hideFormHandler={hideFormHandler}
                              showState={showUserInteractionTable}
                            />
                          </CompleteOverlay>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <GreyButton handler={NextHandler}>Next</GreyButton>
      </div>
    )
  );
}

export default Input;

