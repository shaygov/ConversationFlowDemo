import React from 'react';

const withColumnLayout = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithColumnLayout: React.FC<P> = (props) => {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          margin: '0px 0px 10px',
          padding: '10px',
          background: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '12px',
        }}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };

  return WithColumnLayout;
};

export default withColumnLayout;