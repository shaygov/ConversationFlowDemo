import styled from '@emotion/styled';

const TimeStampStyled = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props: any) => props.theme.token.chat_area.TIMESTAMP.gap}px;

  .TimeStampIcon {
    opacity: ${(props: any) => props.theme.token.chat_area.TIMESTAMP.icon.opacity};
  }
`;

const timeStampTextProps = (props: any) => props.theme.token.chat_area.TIMESTAMP.text;
const TimeStampTextStyled = styled.p`
  font-size: ${props => timeStampTextProps(props).fontSize}px;
  line-height: ${props => timeStampTextProps(props).lineHeight}px;
  font-weight: ${props => timeStampTextProps(props).fontWeight};
  color: ${props => timeStampTextProps(props).color};
  margin: 0;
`;

export { 
  TimeStampStyled,
  TimeStampTextStyled
};