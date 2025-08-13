import React from "react";
import { useStore } from "zustand";
import { StreamChat } from 'stream-chat';
import { toast } from "react-toastify";
import {
  Chat
} from 'stream-chat-react';
import usersStore, {IUsersState} from '@/zustand/users';
import { errorHandler } from "@/helpers";
import Loader from "@components/Loader";
import authStore, { IAuthState } from "@/zustand/auth";
import { ServicesProvider } from '@/contexts/ServicesContext';
import { GlobalContext } from '@/App';

const apiKey = process.env.REACT_APP_GET_STREAM_API_KEY;

// Generate custom Get Stream user id
const getUserId = (userId: string | number) => {
  return `user_${userId}`;
}

const ChatProvider = ({
  children,
}: any) => {
  const [client, setClient] = React.useState<StreamChat | null>();
  const name = useStore(usersStore, (state: IUsersState) => state?.user?.data?.fullName);
  const userId = useStore(usersStore, (state: IUsersState) => state?.user?.data?.id);
  const chatToken = useStore(authStore, (state: IAuthState) => state?.auth?.chatToken);

  React.useEffect(() => {
    if (!userId || !chatToken) {
      return;
    }



    const chatClient = StreamChat.getInstance(apiKey);

    
    async function init() {
      const user: any = {
        id: getUserId(userId),
        name,
        // image: `https://getstream.io/random_png/?name=${name}`,
      };
      try {
        await chatClient.connectUser(user, chatToken);

        // Services will be initialized by ServicesProvider

        // chatClient.on((e)=> {
        //     console.log(e);
        // });
        // const results = await chatClient.search(
        //   { members: { $in: ["user_10"] } },  // channels where you are a member
        //   `@Ahmed`,                         // search text
        //   {
        //     limit: 20,
        //     sort: [{ created_at: -1 }]
        //   }
        // );
        // console.log(results);


        setClient(chatClient);
      } catch (error) {
        toast.error(errorHandler(error, 'Error connecting to chat'));
        setClient(null);
      }
    }

    init();

    return () => {
      setClient(null);
      // Services cleanup will be handled by ServicesProvider
      chatClient.disconnectUser(); 
    }
  }, [userId, chatToken]);
  

  return typeof client === 'undefined' ? (
    <Loader loaderStyle={{ color: '#ffffff' }}>Chat Loading...</Loader>
  ) : client ? (
    <ServicesProvider client={client}>
      <Chat 
        client={client} 
        theme='str-chat__theme-custom str-chat__theme-dark'
      >
        <GlobalContext.Provider value={{ chatClient: client }}>
          {children}
        </GlobalContext.Provider>
      </Chat>
    </ServicesProvider>
  ) : (
    <ServicesProvider client={null}>
      {children}
    </ServicesProvider>
  );
};

export default ChatProvider;