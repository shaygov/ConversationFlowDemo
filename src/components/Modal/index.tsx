import React from "react";
import styled from '@emotion/styled';
import useModalStore, { IModalState } from "@/zustand/modal";
import Loader from "@components/Loader";

const ModalContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalInner = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: 100%;
  max-width: 740px;
  position: relative;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
`;

const ModalBackground = styled.div`
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
`;

const DynamicComponent = ({ component, props }: { component: string | null, props: any }) => {
  const [Component, setComponent] = React.useState<any>();

  React.useEffect(() => {
    const loadComponent = async () => {
      try {
        const importedComponent = await import(`../${component.replace('@components/', '')}`);

        setComponent(() => importedComponent.default);
      } catch (e) {
        console.error(`Component ${component} not found`);
        setComponent(null);
      }
    };

    loadComponent();
  }, [component]);

  if (typeof Component === 'undefined') {
    return <Loader loaderStyle={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}>Loading modal content</Loader>;
  } else if (Component === null) {
    return <Loader loaderStyle={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}>Component not found</Loader>;
  }

  return (
    <Component {...props} />
  );
};

const Modal: React.FC = () => {
  const { component, props } = useModalStore((state: IModalState) => state.content);
  const { disableClose } = useModalStore((state: IModalState) => state.params);
  const setModalContent = useModalStore((state: IModalState) => state.set);

  return !component ? null : (
    <ModalContainer>
      <ModalBackground onClick={() => !disableClose && setModalContent(null)} />

      <ModalInner>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            { props?.back?.text && props?.back?.action ? (
              <button 
                onClick={() => props.back.action()}
                style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span>{props.back.text}</span>
              </button>
            ) : null}
          </div>

          <div>
            { !disableClose ? (
            <button 
              onClick={() => !disableClose && setModalContent(null)}
              style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <span>X</span>
            </button>
          ) : null }
          </div>
        </div>

        <div style={{ flexGrow: 1,  minHeight: 230, overflow: 'auto' }}>
          <DynamicComponent 
            component={component} 
            props={props} 
          />
        </div>
      </ModalInner>
    </ModalContainer>
  )
};

export default Modal;
