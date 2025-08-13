import { css } from '@emotion/react';

export const codeCss = css`
  code {
    line-height: inherit;
    font-weight: inherit;
    color: var(--html-tag-code-color, rgb(242, 68, 97));
    background-color: var(--html-tag-code-backgrond-color, rgb(250, 238, 240));
    box-shadow: var(--html-tag-code-box-shadow, rgb(250, 238, 240) 1px 0px 0px 2px, rgb(250, 238, 240) -1px 0px 0px 2px);
    mix-blend-mode: revert;
    margin-left: 2px;
    margin-right: 2px;
    border-radius: 1px;
  }
  blockquote {
      margin: 0px;
      margin-bottom: 12px;
      padding: 6px 20px;
      border-left: 2px solid var(--typo-primary, #2E3538);
      >:last-child {
          margin-bottom: 0;
      }
  }
`; 