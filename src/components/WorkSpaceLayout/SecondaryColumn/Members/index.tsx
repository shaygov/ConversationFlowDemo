import { 
  AllMembers 
} from './sections';
import MembersSearchInput from './MembersSearchInput';
import { MembersProvider } from './MembersContext';
import {memo} from "react";

export const CURRENT_SECTION_NAME = 'users';

import FavoritesMembers from './sections/FavoritesMembers';
import NewMessagesMembers from './sections/NewMessagesMembers';

function Members() {
  return (
    <MembersProvider>
      <div style={{ display: 'flex', flexDirection: 'column'}}>
        <MembersSearchInput />
        <NewMessagesMembers />  
        <FavoritesMembers />  
        <AllMembers />
      </div>
    </MembersProvider>
 )
}

export default memo(Members);