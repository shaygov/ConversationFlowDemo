import React from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import authStore, { IAuthState } from "@/zustand/auth";
import { RegisterForm } from "@containers/Login/RegisterForm";
import { useLogout } from "@/hooks/useLogout";

const AcceptInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = React.useState<string>('loading');
  const params = new URLSearchParams(window.location.search);
  const acceptInvitation = useStore(authStore, (state: IAuthState) => state.acceptInvitation);
  const [registrationData, setRegistrationData] = React.useState<any>({});
  const { logout } = useLogout();

  const acceptInvitationHandler = React.useCallback(async (body: any) => {
    try {
      const res: any = await acceptInvitation(body);

      if (res instanceof Error) {
        throw res;
      }

      if (res.email) {
        setRegistrationData({
          email: res.email,
        });

        // Show register form
        setContent('register')

        return;
      }

      toast.success(res?.message || 'Invitation accepted successfully!');

      setContent('success');
    } catch (error) {
      // navigate('/');
    }
  }, []);

  const PageContent = React.useCallback(() => {
    switch (content) {
      case 'loading':
        return <div style={{ color: '#ffffff' }}>Loading...</div>;
    
      case 'invalidLink':
        return <div style={{ color: '#ffffff' }}>Invalid invitation link.</div>;

      case 'register':
        return <RegisterForm handleExternal={{
          fields: registrationData,
          onSubmit: (data: any) => {
            acceptInvitationHandler({
              hash: params.get('u'),
              user: {
                ...data,
                email: registrationData.email,
              }
            });
          }
        }} />;

      case 'success':
        return (
          <div>
            <div style={{ color: '#ffffff' }}>Invitation accepted successfully!</div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <button onClick={() => {
                logout();
                navigate('/');
              }}>Log in</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  }, [content, registrationData]);

  React.useEffect(() => {
    const hash = params.get('u');

    if (hash) {
      acceptInvitationHandler({hash});
    } else {
      setContent('invalidLink');
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <PageContent />
    </div>
  );
};

export default AcceptInvitation;
