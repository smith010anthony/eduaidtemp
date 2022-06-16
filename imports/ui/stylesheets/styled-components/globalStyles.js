import { createGlobalStyle } from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import {
  smPaddingX,
  borderRadius,
  borderSize,
  borderSizeSmall,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  dropdownBg,
  colorText,
  colorWhite,
  colorGrayLighter,
  colorOverlay,
} from '/imports/ui/stylesheets/styled-components/palette';

const GlobalStyle = createGlobalStyle`
  // BBBMenu
  @media ${smallOnly} {
    .MuiPaper-root.MuiMenu-paper.MuiPopover-paper {
      top: 0 !important;
      left: 0 !important;
      bottom: 0 !important;
      right: 0 !important;
      max-width: none;
    }
  }

  .MuiPaper-root {
    background-color: ${dropdownBg};
    border-radius: ${borderRadius};
    border: 0;
    z-index: 9999;
    max-width: 22rem;
  }

  // modal
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .permissionsOverlay {
    position: fixed;
    z-index: 1002;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, .85);
    animation: fade-in .5s ease-in;
  }

  .selectQuestion{
    color: var(--color-text);
    margin: 0 0 1.2rem;

    > div {
      border-radius: var(--border-radius);
    }
  }

  .pollnewBtn {
    margin-top: var(--sm-padding-y);
    margin-bottom: var(--sm-padding-y);
    background-color: var(--color-white);
    padding: var(--btn-lg-padding);
    border: 1px solid hsl(0, 0%, 80%);
    transition: all 100ms ease-in-out;
  
    > span {
      color: var(--color-gray);
    }
  
    &[aria-disabled="false"]:not(.active):hover {
      //box-shadow: 0 0 0 1px var(--poll-blue);
      background-color: var(--color-white);
      border-color: #2684FF;
  
      > span {
        color: var(--color-gray);
        opacity: 1;
      }
    }
  
    &.active {
      box-shadow: 0 0 0 1px var(--poll-blue);
      outline: none;
      border-color: var(--poll-blue);
  
      > span {
        color: var(--color-gray-darkest);
        opacity: 1;
      }
    }
  }
  

  .pollBtn:nth-child(even) {
    margin-right: inherit;
    margin-left: var(--sm-padding-y);
  
    [dir="rtl"] & {
      margin-right: var(--sm-padding-y);
      margin-left: inherit;
    }
  }
  
  .pollBtn:nth-child(odd) {
    margin-right: var(--sm-padding-y);
    margin-left: inherit;
  
    [dir="rtl"] & {
      margin-right: inherit;
      margin-left: var(--sm-padding-y);
    }
  }

  .modalOverlay {
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${colorOverlay};
  }

  .fullscreenModalOverlay {
    z-index: 1000;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  // toast
  .toastClass {
    position: relative;
    margin-bottom: ${smPaddingX};
    padding: ${smPaddingX};
    border-radius: ${borderRadius};
    box-shadow: 0 ${borderSizeSmall} 10px 0 rgba(0, 0, 0, 0.1), 0 ${borderSize} 15px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    justify-content: space-between;
    color: ${colorText};
    -webkit-animation-duration: 0.75s;
    animation-duration: 0.75s;
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    max-width: 20rem !important;
    min-width: 20rem !important;
    width: 20rem !important;
    cursor: pointer;
    background-color: ${colorWhite};

    &:hover,
    &:focus {
      background-color: #EEE;
    }
  }

  .toastBodyClass {
    margin: auto auto;
    flex: 1;
    background-color: inherit;
    max-width: 17.75rem !important;
  }

  @keyframes track-progress {
    0% {
      width: 100%;
    }
    100% {
      width: 0;
    }
  }

  .toastProgressClass {
    position: absolute;
    bottom: 0;
    left: 0;
    right: auto;
    width: 0;
    height: 5px;
    z-index: 9999;
    animation: track-progress linear 1;
    background-color: ${colorGrayLighter};
    border-radius: ${borderRadius};

    [dir="rtl"] & {
      left: auto;
      right: 0;
    }
  }

  .actionToast {
    background-color: ${colorWhite};
    display: flex;
    padding: ${smPaddingX};
    border-radius: ${borderRadius};

    i.close {
      left: none !important;
    }
  }

  .raiseHandToast {
    background-color: ${colorWhite};
    padding: 1rem;

    i.close {
      left: none !important;
    }
  }
`;

export default GlobalStyle;
