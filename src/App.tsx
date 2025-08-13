import '@assets/fonts/css/all.min.css';
import 'split-pane-react/esm/themes/default.css';
import React, { createContext } from "react";
import { useStore } from 'zustand';
import { BrowserRouter, Routes, Route } from "react-router";
import { ThemeProvider } from '@emotion/react';
import { ToastContainer } from 'react-toastify';
import GlobalStyles from "@vars/Global";
import ChatStyles from "@vars/Chat";
import data from '@/figmaUtils/base.json';
import Header from "@components/Header/Header";
import MainContainer from "@containers/App";
import AuthProvider from "@containers/AuthProvider";
import ChatProvider from "@containers/Chat";
import Modal from "@components/Modal";
import AccountActivation from "@containers/Activation/Account";
import AcceptInvitation from "@containers/Activation/Invitation";
import authStore, { IAuthState } from '@/zustand/auth';
import MainWrapper from '@components/MainWrapper';
import { WorkspaceProvider } from '@/contexts/WorkspaceProvider';
import { WorkspaceLayoutProvider } from '@/contexts/WorkspaceLayoutProvider';
import { AuthProvider as AuthContextProvider } from '@/contexts/AuthContext';
import { ServicesGuard } from '@/components/ServicesGuard';

export const GlobalContext: any = createContext({});

const App = () => (                
    <AuthProvider>
      <AuthContextProvider>
        <WorkspaceProvider>
        <WorkspaceLayoutProvider>
          <ChatProvider>
            <ServicesGuard>
              <Header />
              <MainWrapper>
                <MainContainer />
              </MainWrapper>
            </ServicesGuard>
          </ChatProvider>
          <Modal />
        </WorkspaceLayoutProvider>
        </WorkspaceProvider>
      </AuthContextProvider>
    </AuthProvider>
);

const AppWrapper: React.FC = () => {
  const authorizationToken = useStore(authStore, (state: IAuthState) => state.auth?.token);
  return (
    <ThemeProvider theme={data}>
      <GlobalStyles />
      <ChatStyles />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            { authorizationToken ? null : <Route path="/activate-account" element={<AccountActivation />} /> }
            <Route path="/accept-invitation" element={<AcceptInvitation />} />
            <Route path="*" element={<div>Not Found</div>} />
          </Routes>
        </BrowserRouter>
        <ToastContainer />
    </ThemeProvider>
  );
};

export default AppWrapper;
