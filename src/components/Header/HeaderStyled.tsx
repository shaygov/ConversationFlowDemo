import styled from '@emotion/styled';
import Theme from '@vars/Theme';

const HeaderStyled = styled.header`
  height: 58px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props: any) => props.theme.token.components.HEADER.wrapper.backgroundColor};
  -webkit-app-region: drag;
`;

const CombinedElements = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  flex: 1 1 100%;
  justify-content: center;
  margin-right: 15px;

  .ArrowsIcon {
    cursor: pointer;
    opacity: ${(props: any) => props.theme.token.components.HEADER.arrowsOpacity};
    transition: opacity 150ms ease-in-out;
    -webkit-app-region: no-drag;

    &:hover {
      opacity: 1;
    }
  }

  .RightArrows {
    margin-right: 23px;
    transform: rotate(180deg);
  }
  
  .LeftArrows {
    margin-right: 23px;
  }
`;

// Search
const SearchWrapperStyled = styled.div`
  width: 100%;
  max-width: 1106px;
  border-radius: 8px;
  -webkit-app-region: no-drag;
`;

const SearchInnerStyled = styled.div`
  height: 36px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: ${(props: any) => props.theme.token.components.HEADER.search.backgroundColor};
  border-radius: ${(props: any) => props.theme.token.components.HEADER.search.borderRadius}px;
  gap: ${(props: any) => props.theme.token.components.HEADER.search.inner.gap}px;

  .SearchIcon {
    opacity: ${(props: any) => props.theme.token.components.HEADER.search.icon.opacity};
  }
`;

const SearchInputStyled = styled.input`
  color: ${Theme["semantic-colors"].greyscale["$G-0"]};
  transition: color 150ms ease-in-out;

  &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
    color: ${(props: any) => props.theme.token.components.HEADER.search.text.color};

  }
  &::-moz-placeholder { /* Firefox 19+ */
    color: ${(props: any) => props.theme.token.components.HEADER.search.text.color};

  }
  &:-ms-input-placeholder { /* IE 10+ */
    color: ${(props: any) => props.theme.token.components.HEADER.search.text.color};

  }
  &:-moz-placeholder { /* Firefox 18- */
    color: ${(props: any) => props.theme.token.components.HEADER.search.text.color};
  }
`;

// User
const UserWrapperStyled = styled.div`
  display: flex;
  align-items: center;
  -webkit-app-region: no-drag;
  gap: ${(props: any) => props.theme.token.components.HEADER.user.wrapper.gap}px;


`;

const UserInnerStyled = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.token.components.HEADER.user.inner.gap}px;

  .UserArrow {
    opacity: ${(props: any) => props.theme.token.components.HEADER.user.icon.opacity};
  }
`;

const UserNameStyled = styled.div`
  margin-right: 10px;
  color: ${Theme["semantic-colors"].greyscale["$G-0"]};
  white-space: nowrap;
`;

export { 
  HeaderStyled, 
  SearchWrapperStyled, 
  SearchInnerStyled, 
  SearchInputStyled, 
  UserWrapperStyled, 
  UserInnerStyled, 
  UserNameStyled,
  CombinedElements
};