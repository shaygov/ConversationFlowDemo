import styled from '@emotion/styled';
import Theme from '@vars/Theme';


export const ReplyButtonStyled = styled.button`
    margin: 8px 0 8px -10px;
    padding: 0;
    background: none;
    border: 0;
    cursor: pointer;
    font-size: inherit;
    display: flex;
    height: 30px;
    padding: 4px 10px;
    margin-left: -10px;
    color: #fff;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-color: transparent;
    border-width: 1px;
    border-style: solid;
    background: none;
    border-radius: 6px;
    flex: none;
    order: 0;
    flex-grow: 0;
`;

export const MessageOuterWrapperStyled = styled.div`
    padding: 12px 0;
`;

export const MessageWrapperStyled = styled.div`
      display: flex;
      position: relative;
      align-items: flex-start;
      justify-content: flex-start;
      width: 100%;
      padding: 10px 12px;
      border-radius: 5px;
    p {
        margin-top: 0px;
        margin-bottom: 10px;
    }
    .str-chat__avatar {
        margin-right: 10px;
    }
    a { 
    color: rgba(58, 134, 255, 1);
    }
    .message-actions {
        transition: opacity 0.2s;
        opacity: 0;
    }
    &.active,
    &:hover {
        background-color: rgba(255, 255, 255, 0.03);
        .message-actions {
            opacity: 1;
        }
        .replay-btn {
            background: linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05)), #3A3C40;
        
            border-color:rgba(255, 255, 255, 0.1);
        }
    }
`; 

export const MessageContentStyled = styled.div`
  width: 100%;
  font-size: ${Theme['fonts']['paragraph-xl-regular'].size};
  font-weight: ${Theme['fonts']['paragraph-xl-regular'].weight};
  line-height:    ${Theme['fonts']['paragraph-xl-regular'].lineheight}; 
`


export const MessageContainerStyled = styled.div`
    display: flex;
    flex-direction: column;  
    width: 100%;
    align-items: flex-start;
    margin-left: 10px;
`;

export const MessageUserNameBarStyled = styled.div`
    display: flex;
    margin-bottom: 5px;
`;

export const MessageFooterBarStyled = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
 
    font-size: ${Theme['fonts']['paragraph-xs-medium'].size};
    font-weight: ${Theme['fonts']['paragraph-xs-medium'].weight};
    line-height:  ${Theme['fonts']['paragraph-xs-medium'].lineheight}; 
    color: #878B92;
`;

export const MessageMetaStyled = styled.div`
    display:flex;
    align-items: center;
    margin: 8px 0;
`