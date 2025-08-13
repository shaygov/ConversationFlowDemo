import React, { useEffect, useState } from 'react';
import { useMessageContext, useChannelStateContext } from 'stream-chat-react';

export default function LatestReply() {
  const { message } = useMessageContext();
  const { channel } = useChannelStateContext();
  const [latestReply, setLatestReply] = useState(null);

  useEffect(() => {
    let isMounted = true;
    if (message.reply_count > 0) {
      channel.getReplies(message.id, {})
        .then(res => {
          if (isMounted && res.messages.length > 0) {
          
            setLatestReply(res.messages[res.messages.length - 1].created_at); // last reply
          }
        });
    }
    return () => { isMounted = false; };
  }, [message, channel]);

  if (!latestReply) return null;

  return (
    <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>
      {latestReply}
    </div>
  );
}