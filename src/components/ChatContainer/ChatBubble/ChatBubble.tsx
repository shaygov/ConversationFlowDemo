import React, { memo } from 'react';
import { useStore } from 'zustand';
import {
  ContentStyled,
  AvatarCommentStyled,
  AvatarNameTimestampStyled,
  AvatarsTextStyled,
  NameWrapperStyled,
  NameInnerStyled,
  NameStyled,
  NameTextStyled,
  ChatOptionsStyled,
  TextWrapperStyled,
  TextInnerStyled,
  TextStyled,
  CommentBadgeStyled,
  CommentBadgeWrapperStyled,
  CommentBadgeTextLeftStyled,
  CommentBadgeTextRightStyled,
  AvatarNameTimestampTopStyled,
  TimeTextStyled,
  LastReplyTextStyled
} from './ChatBubbleStyled';
import Avatar from '@libs/components/widgets/Avatar/Avatar';
import { AvatarSizes } from '@libs/components/widgets/Avatar/Avatar.types';
import { ChatBubbleOptions } from './ChatBubble.constants';
import TimeStamp from '../TimeStamp/TimeStamp';
import ChatBubbleMenu from '../ChatBubbleMenu/ChatBubbleMenu';
import ChatBubbleThread from '../ChatBubbleThread/ChatBubbleThread';
import { ThreadOptions } from '../ChatBubbleThread/ChatBubbleThread.constants';
import authStore, { IAuthState } from '@/zustand/auth';
import usersStore, { IUsersState } from '@/zustand/users';

export interface Props {
  type?: ChatBubbleOptions;
  threadType?: ThreadOptions;
  comment: any;
}



const ChatBubble: React.FC<Props> = ({
  type,
  threadType,
  comment,
}) => {
  const users = useStore(usersStore, (state: IUsersState) => state.users);
  const user: any = (users || []).find((user: any) => user.id === comment.member);
  const userName = user ? `${user?.full_name?.first_name} ${user?.full_name?.last_name}` : '---';

  return (
    <div>
      <div>
        <ContentStyled className={type} type={threadType}>
          <AvatarCommentStyled>
            <AvatarNameTimestampTopStyled>
              <AvatarNameTimestampStyled>
                <Avatar size={AvatarSizes.l}></Avatar>
                <NameWrapperStyled>
                  <NameInnerStyled>
                    <NameStyled>
                      <NameTextStyled>{userName}</NameTextStyled>
                      {type === 'personalMessage' &&
                        <TimeTextStyled>11:54PM</TimeTextStyled>
                      }
                    </NameStyled>
                    <ChatOptionsStyled>
                      {/* <ChatBubbleMenu items={actionItems} /> */}
                      {type === 'recordComment' &&
                        <CommentBadgeStyled className="CommentBadge">
                          <CommentBadgeWrapperStyled>
                            <CommentBadgeTextLeftStyled>#</CommentBadgeTextLeftStyled>
                            <CommentBadgeTextRightStyled>2</CommentBadgeTextRightStyled>
                          </CommentBadgeWrapperStyled>
                        </CommentBadgeStyled>
                      }
                    </ChatOptionsStyled>
                  </NameInnerStyled>
                  {type === 'recordComment' && <TimeStamp label={comment.created_on} />}
                  {type === 'personalMessage' &&
                    <TextStyled dangerouslySetInnerHTML={{__html: comment.message.html}}></TextStyled>
                  }
                </NameWrapperStyled>
              </AvatarNameTimestampStyled>
              {type === 'recordComment' &&
                <TextWrapperStyled>
                  <TextInnerStyled>
                    <TextStyled dangerouslySetInnerHTML={{__html: comment.message.html}}></TextStyled>
                  </TextInnerStyled>
                </TextWrapperStyled>
              }
            </AvatarNameTimestampTopStyled>
            <AvatarsTextStyled>
              <ChatBubbleThread type={threadType} />
              { (threadType === 'personalMessage' || threadType === 'comment') && 
                <LastReplyTextStyled>Last reply today at 3:14 PM</LastReplyTextStyled>
              }
            </AvatarsTextStyled>
          </AvatarCommentStyled>
        </ContentStyled>
      </div>
    </div>
  )
};

export default memo(ChatBubble);