import { Global, css } from '@emotion/react';
import React from 'react';
import Theme from './Theme';

// const userAgent = window.navigator.userAgent;

// let fontFamilies = '';
// if (/Win/i.test(userAgent)) {
//   fontFamilies = "Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
// } else if (/Mac/i.test(userAgent)) {
//   fontFamilies = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
// } else if (/Linux/i.test(userAgent)) {
//   fontFamilies = "Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
// } else {
//   fontFamilies = "Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif";
// }

// document.body.style.fontFamily = fontFamilies;

export const easingBasic = Theme.easing["easing-basic"];
export const easingOut = Theme.easing["ease-out"];
export const easingIn = Theme.easing["ease-in"];
export const timingBasic = Theme.timing["timing-basic"];
export const timingOut = Theme.timing["timing-out"];
export const timingIn = Theme.timing["timing-in"];

const GlobalStyles = () => (
  <Global
    styles={css`
      body {
        font-family: system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-weight: 400;
        background-color: #3A3A3A;
        margin: 0;
        height: 100%;
      }

      * {
       box-sizing: border-box;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.15) transparent;
      }
        
      *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      *::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.15);
        border-radius: 4px;
        transition: background 0.2s;
      }

      *::-webkit-scrollbar-thumb:hover {
            background: #888;
      }

      html {
        overflow: auto;
      }

      html,
      #root {
        height: 100%;
      }

      #root {
        display: flex;
        flex-direction: column;
      }

      input[type="text"] {
        width: 100%;
        box-sizing: border-box;
        background: transparent;
        border: none;
        outline: none;
        padding: 0;

        &:focus {
          outline: none;
        }
      }
    `}
  />
);

export default GlobalStyles;