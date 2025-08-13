import React from "react";
import { useStore } from "zustand";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import authStore, { IAuthState } from "@/zustand/auth";

const Activation: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = React.useState<string>(null);
  const params = new URLSearchParams(window.location.search);
  const activate = useStore(authStore, (state: IAuthState) => state.activation);

  React.useEffect(() => {
    const hash = params.get('u');

    if (hash) {
      activate(hash).then((res: any) => {
        if (res instanceof Error) {
          navigate('/');

          return;
        }

        toast.success('Account activated successfully!');
        navigate('/');
      })
    } else {
      setContent('Invalid activation link.');
    }
  }, []);

  return content;
};

export default Activation;
