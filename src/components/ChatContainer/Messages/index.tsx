import React from "react";
import { withChannelData } from './withChannelData';
import MessagesCore from './MessagesCore';


const Messages = withChannelData(MessagesCore);

Messages.displayName = 'Messages';

export default Messages;
