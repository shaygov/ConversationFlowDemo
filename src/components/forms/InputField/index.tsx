import React from "react";
import { Input, InputWrapper } from './style';

interface IInputProps {
  placeholder?: string;
  name: string;
  value?: string;
  type?: string;
  disabled?: boolean;
  onChange: (e: any) => void;
}

const InputField = React.forwardRef<HTMLInputElement, IInputProps>(
  ({ placeholder = '', name, onChange, ...restProps }, ref) => {
    return (
      <InputWrapper>
        <Input
          placeholder={placeholder}
          name={name}
          onChange={onChange}
          ref={ref}
          {...restProps}
        />
      </InputWrapper>
    );
  }
);

export default InputField;
