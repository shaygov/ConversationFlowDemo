import React from "react";
import { useStore } from "zustand";
import TextInput from "@components/forms/InputField";
import Button from '@components/forms/Button';
import { InputWrapper, Form } from './';
import authStore, { IAuthState } from '@/zustand/auth';

const defaultRegisterData = {
  email: '',
  password: '',
  full_name: '',
};

interface IRegisterFormProps {
  handleExternal?: {
    fields: {
      [key: string]: any;
    };
    onSubmit: (data: any) => void;
  };
}

export const RegisterForm: React.FC<IRegisterFormProps> = ({ handleExternal }) => {
  const register = useStore(authStore, (state: IAuthState) => state.register);
  const isAuthLoading = useStore(authStore, (state: IAuthState) => state.isLoading);

  const [registerData, setRegisterData] = React.useState(defaultRegisterData);

  /**
   * Register form input handlers
   */
  const onRegisterChangeHandler = React.useCallback((e: any) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  }, [JSON.stringify(registerData)]);

  /**
   * Register form submit handler
   */
  const onRegisterSubmitHandler = React.useCallback((e: any) => {
    e.preventDefault();

    if (handleExternal && handleExternal?.onSubmit) {
      handleExternal.onSubmit(registerData);

      return;
    }

    register(registerData).then(() => {
      setRegisterData(defaultRegisterData);
    });
  }, [JSON.stringify(registerData)]);

  const submitDisabled = (!handleExternal || (handleExternal && !handleExternal?.fields?.email)) && !registerData.email ||
  (!handleExternal || (handleExternal && !handleExternal?.fields?.password)) && !registerData.password ||
  (!handleExternal || (handleExternal && !handleExternal?.fields?.full_name)) && !registerData.full_name ||
  isAuthLoading;

  return (
    <Form onSubmit={onRegisterSubmitHandler}>
      <InputWrapper>
        <TextInput 
          placeholder="Full Name"
          name="full_name"
          onChange={onRegisterChangeHandler}
          value={handleExternal && handleExternal?.fields?.full_name ? handleExternal.fields.full_name : registerData.full_name}
          type="text"
          disabled={isAuthLoading && handleExternal?.fields?.full_name}
        />
      </InputWrapper>

      <InputWrapper>
        <TextInput 
          placeholder="E-mail"
          name="email"
          onChange={onRegisterChangeHandler}
          value={handleExternal && handleExternal?.fields?.email ? handleExternal.fields.email : registerData.email}
          type="email"
          disabled={isAuthLoading || handleExternal?.fields?.email}
        />
      </InputWrapper>

      <InputWrapper>
        <TextInput 
          placeholder="Password"
          name="password"
          onChange={onRegisterChangeHandler}
          value={handleExternal && handleExternal?.fields?.password ? handleExternal.fields.password : registerData.password}
          type="password"
          disabled={isAuthLoading || handleExternal?.fields?.password}
        />
      </InputWrapper>

      <Button 
        type="submit" 
        name="submit"
        disabled={submitDisabled}
        style={{
          width: '100%',
          marginTop: '16px',
          cursor: 'pointer',
        }}
      >Register</Button>
    </Form>
  );
};
