import React, { FC, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

interface Props {
  active: boolean;
  children: React.ReactNode;
  maxHeight?: number;
}

const Accordion: FC<Props> = ({ children, active, maxHeight}) => {
  // const nodeRef = useRef<HTMLDivElement>(null);

  return !active ? null : (
    <div
      // ref={nodeRef}
      // style={{
      //   height: `${maxHeight}px`,
      //   overflow: 'hidden',
      //   transition: 'height 0.15s ease-in-out',
      // }}
    >
      {children}
    </div>
    // <CSSTransition
    //   in={active}
    //   timeout={150}
    //   unmountOnExit
    //   nodeRef={nodeRef}
    // >
    //   <div
    //     ref={nodeRef}
    //     style={{
    //       height: `${maxHeight}px`,
    //       overflow: 'hidden',
    //       transition: 'height 0.15s ease-in-out',
    //     }}
    //   >
    //     {children}
    //   </div>
    // </CSSTransition>
  );
};

export default Accordion;
