import React, { useMemo, useState } from "react";
import { useStore } from "zustand";
// import { appsDataSelector } from "@recoil/apps";
// import {IAppsData} from '@/types/apps/index.d';
import InputField from "@components/forms/ChatInputField";
import { CURRENT_SECTION_NAME } from "@/components/WorkSpaceLayout/PrimaryColumn/Sections/Navigation";
import Row from './Row';
import appStore, { IAppState } from "@/zustand/app";

const Messages = () => {
  const [active, setActive] = useState<number | string | null>(null);
  const activeSection = useStore(appStore, (state: IAppState) => state.get('activeSection'));
  const activeSolution = useStore(appStore, (state: IAppState) => state.get('activeSolution'));
  const setActiveMessage: any = useStore(appStore, (state: IAppState) => state.set);
  const isVisible = useMemo(() => activeSection === CURRENT_SECTION_NAME && activeSolution, [
    activeSection,
    activeSolution,
  ]);

  return 'under construction';
  // const messagesItems = useMessagesStore((state: IMessagesState) => state.messages);

  // React.useEffect(() => {
  //   if (!active) {
  //     return;
  //   }

  //   const activeItem: any = messagesItems.find((item) => item.id === active);

  //   setActiveMessage({
  //     activeRecord: activeItem.recordId,
  //   });
  // }, [active]);

  // return isVisible ? (
  //   <>
  //     <InputField
  //       placeholder="Find Records"
  //       onChange={() => {}}
  //     />

  //     { messagesItems.map((item) => (
  //       <div key={item.id}>
  //         <Row 
  //           item={item}
  //           active={active}
  //           onClick={() => setActive(item.id)}
  //         />
  //       </div>
  //     )) } 
  //   </>
  // ) : null;
};

export default Messages;
