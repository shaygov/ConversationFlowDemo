import React from 'react';
import { Global, css } from '@emotion/react';
import Theme from '@/theme-variables/Theme';

import 'stream-chat-react/dist/css/v2/index.css'

const ChatStyles = () => (
  <Global
    styles={css`
      .str-chat {
        --str-chat__channel-background-color: transparent;
        --str-chat__thread-background-color: transparent;
        --str-chat__message-list-background-color: transparent;
        --str-chat__thread-header-background-color: transparent;
      }
      .str-chat__thread-container .str-chat__thread-header {
        padding: 0;
      }
      .str-chat__close-thread-button  {
        padding: 0;
      }
      .str-chat__virtual-list-message-wrapper {
        position: relative
      }
      .str-chat__virtual-list {
        background: none
      }
      .str-chat__virtual-list .str-chat__message-list-scroll>div .str-chat__li {
        margin: 0;
        padding: 0;
      }
      .str-chat__virtual-list .str-chat__message-list-scroll>div {
        margin: 0;
        padding: 0;
      }
      .str-chat__thread-container {
        margin-left: 10px;
        padding-left: 10px;
        flex: 0.8;
      }
    `}
  />
);

export default ChatStyles;
