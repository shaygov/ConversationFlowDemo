import styled from "@emotion/styled";

import Theme from "@vars/Theme";
import { timingIn, easingBasic } from "@vars/Global";


const InputWrapperStyled = styled.div`
  border-width: ${(props: any) => props.theme.token.components.SEARCH_INPUT.typing.borderWidth}px;
  border-style: ${(props: any) => props.theme.token.components.SEARCH_INPUT.typing.borderType};
  border-color: transparent;
  transition: background ${timingIn}, border-color ${timingIn} ${easingBasic};

  ${(props: any) => {
    const globals = props.theme.token.components.SEARCH_INPUT.globals;
    const { 
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      cornerRadius,
      backgroundColor,
      searchContainer
    } = globals;

    return `
      padding: ${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px;
      margin: ${searchContainer.paddingTop}px 0px 20px 0px;
      border-radius: ${cornerRadius}px;
      background: ${backgroundColor};
    `;
  }};

  &:hover {
    background: ${(props: any) => props.theme.token.components.SEARCH_INPUT.hover.backgroundColor};
  }

  &.isFocus {
    border-color: ${(props: any) => props.theme.token.components.SEARCH_INPUT.typing.borderColor};

    .RightControls {
      width: 25px;
      opacity: 0;
      pointer-events: none;
    }

    .InputField {
      color: ${Theme["semantic-colors"].greyscale["$G-0"]};
    }

    .DeleteIcon {
      opacity: 1;
      pointer-events: all;
    }
  }
`;

const getGlobalsInner = (props: any) => props.theme.token.components.SEARCH_INPUT.globals.inner;
const InputInnerStyled = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  padding-top: ${props => getGlobalsInner(props).paddingTop}px;
  padding-right: ${props => getGlobalsInner(props).paddingRight}px;
  padding-bottom: ${props => getGlobalsInner(props).paddingBottom}px;
  padding-left: ${props => getGlobalsInner(props).paddingLeft}px;
`;

const RightControlsStyled = styled.div`
  display: flex;
  align-items: center;
  transition: opacity 150ms ease-in-out;
`;

const DeleteIcon = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%) rotate(0deg);
  opacity: 0;
  pointer-events: none;
  transition: opacity 150ms ease-in-out, transform 150ms ease-in-out;

  &:hover {
    transform: translateY(-50%) rotate(90deg);
  }
`;

const getRightControls = (props: any) => props.theme.token.components.SEARCH_INPUT.globals.rightControls;
const IconWrapperStyled = styled.div`
  margin-left: ${props => getRightControls(props).gap}px;
  border-radius: ${props => getRightControls(props).tree.cornerRadius}px;
  box-sizing: border-box;
  position: relative;
  transition: background 150ms ease-in-out;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:before {
    width: 1px;
    height: 100%;
    content: '';
    background: rgba(0, 0, 0, 0.1);
    position: absolute;
    left: -${props => getRightControls(props).gap}px;
    top: 0;
  }

  &.Tree {
    width: ${props => getRightControls(props).tree.width}px;
    height: ${props => getRightControls(props).tree.height}px;
    padding-top: ${props => getRightControls(props).tree.paddingTop}px;
    padding-right: ${props => getRightControls(props).tree.paddingRight}px;
    padding-bottom: ${props => getRightControls(props).tree.paddingBottom}px;
    padding-left: ${props => getRightControls(props).tree.paddingLeft}px;
    margin-right: ${props => getRightControls(props).gap}px;

    .TreeIcon {
      opacity: ${props => getRightControls(props).tree.icon.opacity};
      transition: opacity 150ms ease-in-out;
    }

    &:hover {
      background: ${(props: any) => props.theme.token.components.SEARCH_INPUT.globals.rightControls.stateHover.tree.backgroundColor};

      .TreeIcon {
        opacity: ${(props: any) => props.theme.token.components.SEARCH_INPUT.globals.rightControls.stateHover.tree.icon.opacity};

      }
    }

    &.active {
      background: ${(props: any) => props.theme.token.components.SEARCH_INPUT.globals.rightControls.stateActive.tree.backgroundColor};
    }
  }
  
  &.Filter {
    width: ${props => getRightControls(props).filter.width}px;
    height: ${props => getRightControls(props).filter.height}px;
    padding-top: ${props => getRightControls(props).filter.paddingTop}px;
    padding-right: ${props => getRightControls(props).filter.paddingRight}px;
    padding-bottom: ${props => getRightControls(props).filter.paddingBottom}px;
    padding-left: ${props => getRightControls(props).filter.paddingLeft}px;

    &:hover {
      background: ${(props: any) => props.theme.token.components.SEARCH_INPUT.globals.rightControls.stateHover.filter.backgroundColor};
    }

    &.active {
      background: ${(props: any) => props.theme.token.components.SEARCH_INPUT.globals.rightControls.stateActive.filter.backgroundColor};
    }
  }
`;

const InputStyled = styled.input`
  transition: color ${timingIn} ${easingBasic};
  
  ${(props: any) => {
    const searchInput = props.theme.token.components.SEARCH_INPUT;
    
    const { 
      fontSize,
      fontWeight,
      lineHeight,
      color
    } = searchInput.globals.text;

    return `
      color: ${color};
      font-size: ${fontSize}px;
      line-height: ${lineHeight}px;
      font-weight: ${fontWeight};
    `;
  }};

  &:hover {
    color: ${(props: any) => props.theme.token.components.SEARCH_INPUT.hover.text.color};
  }
`;



export { InputWrapperStyled, InputStyled, InputInnerStyled, RightControlsStyled, IconWrapperStyled, DeleteIcon };
