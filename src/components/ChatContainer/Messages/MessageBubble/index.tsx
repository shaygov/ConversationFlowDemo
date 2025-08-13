import Avatar from '@/libs/components/widgets/Avatar/Avatar';
import { AvatarSizes } from "@/libs/components/widgets/Avatar/Avatar.types";
import { Text  } from '@/libs/components/typography/Text/Text';
import { getInitials } from '@/helpers';
import emojiData from '@/assets/emoji/data-by-emoji.json';
export interface AvatarImage {
    src: string;
    alt?: string;
  }
type MessageBubbleProps = { 
  children : React.ReactNode,
  isMyMessage: boolean,
   className: string,
   user: {
      username: string,
      avatarUrl: string,
      isOnline: boolean
    },
    message: {
      timestamp: string | Date,
      reactions: string[],
    },
    isCurrentUser?: boolean
 };

import  {
  MessageWrapperStyled,
  MessageContainerStyled,
  MessageUserNameBarStyled,
  MessageContentStyled,
  MessageOuterWrapperStyled
} from './style';

function getEmojiBySlug(slug: string) {
  const found = Object.entries(emojiData).find(([, v]) => v.slug === slug);
  return found ? found[0] : slug;
}


export default function MessageBubble({children, isMyMessage, className, user: {username, avatarUrl, isOnline }, message: {reactions, timestamp}, isCurrentUser}: MessageBubbleProps) {
  const initials = getInitials(username);
  return <MessageOuterWrapperStyled><MessageWrapperStyled className={className}>
    <Avatar 
      image={{
          src: avatarUrl
      }} 
      text={initials}  
      online={isOnline} 
      size={AvatarSizes.l}
      className= {isMyMessage? 'me': ''}
   />
    <MessageContainerStyled>
    <MessageUserNameBarStyled>
      <Text
        tag="div"
        size = "l"
        weight='medium'
      >{username}</Text>
      
      {timestamp && (
            <Text
            tag="div"
            size = "s"
            weight='medium'
            styles={{marginLeft: 10, opacity: 0.5}}
          >
              {typeof timestamp === 'string'
                ? new Date(timestamp).toLocaleTimeString()
                : timestamp.toLocaleTimeString()}
            </Text>
          )}
    </MessageUserNameBarStyled>
     <MessageContentStyled>
     {children}
    <div style={{ display: 'flex', gap: 8, margin: '4px 0' }}>
      {Object.entries(
       reactions.reduce((acc, reaction) => {
        acc[reaction] = (acc[reaction] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
      ).map(([slug, count]) => (
        <span key={slug} style={{ fontSize: 20, display: 'flex', alignItems: 'center', gap: 4 }}>
          {getEmojiBySlug(slug)}
          {count > 1 ? ` ${count}` : ''}
        </span>
      ))}
    </div>
    </MessageContentStyled>   
    </MessageContainerStyled>
  </MessageWrapperStyled>
  </MessageOuterWrapperStyled>
}