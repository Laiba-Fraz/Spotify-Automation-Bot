import React from 'react';
import { successToast, failToast } from "../../Utils/utils";
import InputWithButton from "./InputWithButton";
import Cut from "../../assets/Icons/Cut";
import classes from "./PositiveandNegativekeywordInput.module.css";

const KeywordInput = ({ 
  inputs = [
    { label: "Keywords:", array: "keywords" }
  ],
  el,
  AddkeywordHandler,
  removeKeywordHandler,
  index,
  InnerIndex
}) => {
  const validateAndAddKeyword = (value, currentType, oppositeType) => {
    if (!oppositeType) {
      if (el[currentType].includes(value)) {
        successToast("Already added keyword");
        return;
      }
      AddkeywordHandler(index, InnerIndex, value, currentType);
      return;
    }

    if (!el[oppositeType].includes(value)) {
      if (el[currentType].includes(value)) {
        successToast("Already added keyword");
      } else {
        AddkeywordHandler(index, InnerIndex, value, currentType);
      }
    } else {
      failToast("Positive and Negative keywords cannot have same keywords");
    }
  };

  return (
    <div className={classes.keywordsInputContainer}>
      {inputs.map((input, idx) => (
        <React.Fragment key={idx}>
          <div className={classes.InputContainer}>
            <InputWithButton
              lable={input.label}
              type="text"
              name={input.array}
              buttonText="Add"
              handler={(value) => {
                validateAndAddKeyword(
                  value, 
                  input.array,
                  inputs.find(i => i.array !== input.array)?.array
                );
              }}
            />
          </div>
          <div className={classes.keywordsContainer}>
            {(el[input.array] || []).map((item, keywordIdx) => (
              <div className={classes.keyword} key={keywordIdx}>
                <p>{item}</p>
                <button>
                  <Cut
                    showHandler={() => 
                      removeKeywordHandler(index, InnerIndex, item, input.array)
                    }
                  />
                </button>
              </div>
            ))}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default KeywordInput;
