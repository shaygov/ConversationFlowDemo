import React from 'react';

interface ChatPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ children, ...rest }) => (
  <div
    style={{
      width: '100%',
      height: "100%",
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      ...((rest.style as React.CSSProperties) || {})
    }}
    {...rest}
  >
    {children}
  </div>
);

export default ChatPanel; 