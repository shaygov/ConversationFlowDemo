import React from 'react';
import Select, { Props as SelectProps, StylesConfig, GroupBase } from 'react-select';

const customSelectStyles: StylesConfig<any, boolean, GroupBase<any>> = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(243, 243, 244, 0.08)',
    color: '#fff',
    boxShadow: 'none',
    minHeight: 38,
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  input: (provided) => ({
    ...provided,
    color: '#fff',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(30, 30, 30, 0.98)',
    color: '#fff',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused
      ? 'rgba(255,255,255,0.15)'
      : 'rgba(30,30,30,0.98)',
    color: '#fff',
    cursor: 'pointer',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#fff',
    opacity: 0.7,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#fff',
    opacity: 0.7,
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(243,243,244,0.08)',
  }),
};

const CustomSelect = React.forwardRef(function CustomSelect<T = unknown>(props: SelectProps<T>, ref: React.Ref<any>) {
  return <Select {...props} styles={customSelectStyles} ref={ref} />;
});

export default CustomSelect; 