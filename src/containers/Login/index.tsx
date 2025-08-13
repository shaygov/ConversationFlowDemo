import React from "react";
import styled from "@emotion/styled";
import { RegisterForm } from "./RegisterForm";
import { LoginForm } from "./LoginForm";


export const LoginContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: rgba(45, 45, 45, 0.94);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Form = styled.form`
  width: 100%;
  max-width: 480px;
  background-color: rgba(52, 52, 52, 1);
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 0 23px rgba(255,255,255,0.25);
  margin-bottom: 48px;
`;

export const InputWrapper = styled.div`
  margin-bottom: 8px;
`;

const Login = () => {
  const [form, setForm] = React.useState('login');


  return (
    <LoginContainer>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input type="radio" name="form" id="radio-login" checked={form === 'login'} onChange={() => setForm('login')} />
          <label htmlFor="radio-login" style={{ color: '#ffffff', marginLeft: 4 }}>Sign In</label>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 32 }}>
          <input type="radio" name="form" id="radio-register" checked={form === 'register'} onChange={() => setForm('register')} />
          <label htmlFor="radio-register" style={{ color: '#ffffff', marginLeft: 4 }}>Sign Up</label>
        </div>
      </div>

      { form === 'register' ? <RegisterForm /> : null }
      { form === 'login' ? <LoginForm /> : null }
    </LoginContainer>
  );
};

export default Login;
