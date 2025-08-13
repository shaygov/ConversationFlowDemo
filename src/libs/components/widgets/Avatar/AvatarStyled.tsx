import styled from '@emotion/styled';
import { AvatarSizes } from './Avatar.types';
import Theme from '@vars/Theme';

export interface AvatarProps {
  opened?: boolean;
  size?: AvatarSizes;
};

const AvatarStyled = styled.div<AvatarProps>`
  width: ${(props: any) => props.theme.token.components.AVATAR.size[props.size].width}px;
  height: ${(props: any) => props.theme.token.components.AVATAR.size[props.size].height}px;
  border-radius: 50%;
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  img {
    width: 100%;
    max-width: 100%;
  }

  &.Initials {
    background-color: ${Theme['semantic-colors'].base['b-green']}
  }

  &.me {
    background-color: #444;
  }

  &.online {
    &::before {
      content: '';
      position: absolute;
      top: 0px;
      right: 0px;
      width: 21%;
      height: 21%;
      background-color: rgba(62, 172, 64, 1);
      border-radius: 50%;
      border-width:  ${(props: any) => 0.09 * props.theme.token.components.AVATAR.size[props.size].width}px;
      border-style: solid;
      border-color: rgba(54, 49, 60, 1);
    }
  }
`;

const AvatarInitialsStyled = styled.div<AvatarProps>`
  font-size: 10px;
  font-weight: 700;
  line-height: 10px;
  text-transform: uppercase;
  color: ${Theme['semantic-colors'].greyscale['$G-0']};
   &.me {
    color: #fff
  }
`;

export {AvatarStyled, AvatarInitialsStyled};