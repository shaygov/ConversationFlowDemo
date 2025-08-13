import React, { FC, memo, FocusEvent, InputHTMLAttributes, useState, ChangeEvent } from "react";
import cx from "classnames";

import { InputWrapperStyled, InputStyled, InputInnerStyled, RightControlsStyled, IconWrapperStyled, DeleteIcon } from "./InputFieldStyled";
import { useDependentState } from "@libs/components/hooks/useDependentState";
import Icon from "@libs/components/widgets/Icon/Icon";

export interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  placeholder?: string;
  onChangeValue?: (value: string) => BodyInit;
  isValueInvalidForChange?: (value: string) => boolean;
}

const InputField: FC<Props> = ({ 
  placeholder,
  value,
  onFocus,
  onBlur,
  onChange = () => null,
  onChangeValue = () => null,
  isValueInvalidForChange
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [treeActive, setTreeActive] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const [inputValue, setInputValue] = useDependentState(value || '');

  const classes = cx("InputWrapper", {
    "isFocus": isFocus
  });

  const filterClasses = cx("Filter", {
    "active": filterActive
  });

  const treeClasses = cx("Tree", {
    "active": treeActive
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (isValueInvalidForChange && isValueInvalidForChange(e.target.value)) return;

    setInputValue(e.target.value);
    onChange(e);
    if (onChangeValue) onChangeValue(e.target.value);
  }

  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    if (onFocus) onFocus(e);
    setIsFocus(true);
  }

  const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    if (onBlur) onBlur(e);
    setIsFocus(false);
  }

  const filterToggle = () => {
    setFilterActive(!filterActive);
  };

  const treeToggle = () => {
    setTreeActive(!treeActive);
  };

  return (
    <InputWrapperStyled className={classes}>
      <InputInnerStyled>
        <InputStyled 
          placeholder={placeholder}
          type="text"
          value={inputValue}
          className="InputField"
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <RightControlsStyled className="RightControls">
          <IconWrapperStyled className={treeClasses} onClick={treeToggle}>
            <Icon
              name="tree-icon"
              size="S"
              className="TreeIcon"
            />
          </IconWrapperStyled>
          <IconWrapperStyled className={filterClasses} onClick={filterToggle}>
            <Icon
              name="filter"
              size="S"
            />
          </IconWrapperStyled>
        </RightControlsStyled>
        <DeleteIcon className="DeleteIcon">
          <Icon
            name="close"
            size="S"
          />
        </DeleteIcon>
      </InputInnerStyled>
    </InputWrapperStyled>
  );
};

export default memo(InputField);


