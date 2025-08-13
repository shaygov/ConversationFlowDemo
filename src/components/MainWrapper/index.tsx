import React from 'react';
import styled from '@emotion/styled';


interface MainWrapperProps {
  children: React.ReactNode;
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("data:image/svg+xml;charset=utf8,%3C?xml version='1.0' encoding='UTF-8'?%3E%3Csvg width='1655' height='900' viewBox='0 0 1655 900' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23clip0_1368_57808)'%3E%3Crect width='1655' height='900' fill='%233A3A3A'/%3E%3Cg opacity='0.7' filter='url(%23filter0_f_1368_57808)'%3E%3Cellipse cx='96' cy='107.5' rx='187' ry='46.5' fill='%233A86FF'/%3E%3C/g%3E%3Cg opacity='0.2' filter='url(%23filter1_f_1368_57808)'%3E%3Cellipse cx='366' cy='725' rx='229' ry='240' fill='%233A86FF'/%3E%3C/g%3E%3Cg opacity='0.2' filter='url(%23filter2_f_1368_57808)'%3E%3Cellipse cx='1561' cy='309' rx='229' ry='240' fill='%23FFB938'/%3E%3C/g%3E%3C/g%3E%3Cdefs%3E%3Cfilter id='filter0_f_1368_57808' x='-395' y='-243' width='982' height='701' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='152' result='effect1_foregroundBlur_1368_57808'/%3E%3C/filter%3E%3Cfilter id='filter1_f_1368_57808' x='-167' y='181' width='1066' height='1088' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='152' result='effect1_foregroundBlur_1368_57808'/%3E%3C/filter%3E%3Cfilter id='filter2_f_1368_57808' x='1028' y='-235' width='1066' height='1088' filterUnits='userSpaceOnUse' color-interpolation-filters='sRGB'%3E%3CfeFlood flood-opacity='0' result='BackgroundImageFix'/%3E%3CfeBlend mode='normal' in='SourceGraphic' in2='BackgroundImageFix' result='shape'/%3E%3CfeGaussianBlur stdDeviation='152' result='effect1_foregroundBlur_1368_57808'/%3E%3C/filter%3E%3CclipPath id='clip0_1368_57808'%3E%3Crect width='1655' height='900' fill='white'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E");
`;


function MainWrapper({ children }: MainWrapperProps) {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  );
}

export default MainWrapper;