import React from "react";
import { useStore } from "zustand";
import TextInput from "@components/forms/InputField";
import Button from '@components/forms/Button';
import { InputWrapper, Form } from './';
import authStore, { IAuthState } from '@/zustand/auth';

export const LoginForm: React.FC = () => {
  const login = useStore(authStore, (state: IAuthState) => state.login);
  const isAuthLoading = useStore(authStore, (state: IAuthState) => state.isLoading);

  const [loginData, setLoginData] = React.useState({
    email: '',
    password: '',
  });

  /**
   * Login form input handlers
   */
  const onLoginChangeHandler = React.useCallback((e: any) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  }, [JSON.stringify(loginData)]);

  /**
   * Login form submit handler
   */
  const onLoginSubmitHandler = React.useCallback((e: any) => {
    e.preventDefault();

    login(loginData);
  }, [JSON.stringify(loginData)]);
  return (
      <Form onSubmit={onLoginSubmitHandler}>
        <InputWrapper>
          <TextInput 
            placeholder="E-mail"
            name="email"
            onChange={onLoginChangeHandler}
            value={loginData.email}
            type="email"
            disabled={isAuthLoading}
          />
        </InputWrapper>

        <InputWrapper>
          <TextInput 
            placeholder="Password"
            name="password"
            onChange={onLoginChangeHandler}
            value={loginData.password}
            type="password"
            disabled={isAuthLoading}
          />
        </InputWrapper>

        <Button 
          type="submit" 
          name="submit"
          disabled={!loginData.email || !loginData.password || isAuthLoading}
          style={{
            width: '100%',
            marginTop: '16px',
            cursor: 'pointer',
          }}
        >Log in</Button>
      </Form>
  );
};
