import React from "react";

const Loader = ({
  children,
  style = {},
  loaderStyle = {},
  ...restProps
}: any) => {
  return (
    <div 
      style={{ 
        width: '100%',
        height: '100%',
        ...style,
        position: 'relative'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          ...loaderStyle
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Loader;
