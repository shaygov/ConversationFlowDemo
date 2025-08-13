import styled from '@emotion/styled';
import Theme from '@vars/Theme';

export const GroupTitle = styled.h5`
  margin-top: 0px;
  margin-bottom: 15px;
  padding: 0px 0px 0px 5px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  &:last-child {
    display: none;
  }
`;

export const ItemRowStyled = styled.div`
  &:last-child {
   &:after {
      content: '';
      display: block;
      width: 100%;
      height: 1px;
      background-color: #FFFFFF;
      opacity: 0.08;
      margin: 20px 0 20px;
  }
`;

export const GroupContainer = styled.div``; 