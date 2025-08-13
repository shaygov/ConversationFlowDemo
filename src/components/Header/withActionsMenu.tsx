import React, { useState, useRef, useEffect } from 'react';
import ActionsMenu from '@components/Header/ActionsMenu';


const withActionsMenu = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  const WithActionsMenu: React.FC<P> = (props) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    const handleWrapperClick = () => {
      setIsMenuOpen(!isMenuOpen);
    };

    return (
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <div onClick={handleWrapperClick} style={{ cursor: 'pointer' }}>
          <WrappedComponent {...props} />
        </div>
        
        {isMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              zIndex: 1000,
              marginTop: 8
            }}
          >
            <ActionsMenu isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
          </div>
        )}
      </div>
    );
  };

  return WithActionsMenu;
};

export default withActionsMenu; 