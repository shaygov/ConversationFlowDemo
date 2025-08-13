import styled from '@emotion/styled';
import {ReplyButtonStyled} from './style';



function formatLastReply(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return `today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  return date.toLocaleDateString();
}


export default function MessageRepliesCountButton({
    onClick,
    replyCount,
    lastReplayAt
  }: {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    replyCount: number;
    lastReplayAt: string
  }) {


  return <><ReplyButtonStyled className="replay-btn" onClick={onClick}>{replyCount} replies</ReplyButtonStyled>  Last reply at {formatLastReply(lastReplayAt)}</>

}