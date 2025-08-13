import styled from '@emotion/styled';
import Theme from '@vars/Theme';

export interface ButtonProps  {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean;
  /**
   * What background color to use
   */
  backgroundColor?: string;
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large';
};

const Button = styled.button<ButtonProps>`
  font-size: ${({size}) => {
    switch(size) {
      case 'small': return '12px';
      case 'medium': return '16px';
      case 'large': return '20px';
      default: return '16px';
    }
  }};
  padding: ${({size}) => {
    switch(size) {
      case 'small': return '5px 10px';
      case 'medium': return '10px 20px';
      case 'large': return '15px 30px';
      default: return '10px 20px';
    }
  }};
  color: ${({primary}) => primary ? 'white' : 'black'};
  background-color: ${({backgroundColor}) => backgroundColor || 'lightgray'};
  border: 2px solid ${Theme['semantic-colors'].base['b-pink']};
  border-radius: 5px;
  cursor: pointer;
`;

export default Button;