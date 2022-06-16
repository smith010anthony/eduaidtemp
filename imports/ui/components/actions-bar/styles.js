import styled from 'styled-components';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import { smPaddingX, smPaddingY } from '/imports/ui/stylesheets/styled-components/general';
import { colorWhite,
  colorDanger,
  colorGrayDark,
  colorPrimary } from '/imports/ui/stylesheets/styled-components/palette';
import Button from '/imports/ui/components/common/button/component';
import { barsPadding, borderSize } from '/imports/ui/stylesheets/styled-components/general';


const ActionsBar = styled.div`
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  display: inherit;
  flex: 0;

  > * {
    margin: 0 ${smPaddingX};

    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }

  @media ${smallOnly} {
    bottom: ${smPaddingX};
    left: ${smPaddingX};
    right: auto;

    [dir="rtl"] & {
      left: auto;
      right: ${smPaddingX};
    }
  }

`;

const Center = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
  justify-content: center;

  > * {
    margin: 0 ${smPaddingX};

    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }

`;

const Right = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: relative;

  [dir="rtl"] & {
    right: auto;
    left: ${smPaddingX};
  }

  @media ${smallOnly} {
    right: 0;
    left: 0;
    display: contents;
  }

  > * {
    margin: 0 ${smPaddingX};

    @media ${smallOnly} {
      margin: 0 ${smPaddingY};
    }
  }
`;

const RaiseHandButton = styled(Button)`
  ${({ emoji }) => emoji !== 'raiseHand' && `
      span {
        box-shadow: none;
        background-color: transparent !important;
        border-color: ${colorWhite} !important;
      }
   `}
`;

const NavbarToggleButton = styled(Button)`
  // color: ${colorPrimary};
  // background-color: ${colorWhite};
  ${({ ghost }) => ghost && `
  span {
    box-shadow: none;
    color: ${colorWhite};
    background-color: ${colorPrimary}; !important;
    border-color: ${colorPrimary} !important;
  }
`}
  margin: 0;
  z-index: 3;

  // &:hover,
  // &:focus {
  //   span {
  //     background-color: transparent !important;
  //     color: ${colorWhite} !important;
  //     opacity: .75;
  //   }
  // }


  

  ${({ hasNotification }) => hasNotification && `
    position: relative;

    &:after {
      content: '';
      position: absolute;
      border-radius: 50%;
      width: 12px;
      height: 12px;
      bottom: ${borderSize};
      right: 3px;
      background-color: ${colorDanger};
      border: ${borderSize} solid ${colorGrayDark};
    }
  `}
  svg {
    font-size: 200%;
  }
`;
export default {
  ActionsBar,
  Left,
  Center,
  Right,
  RaiseHandButton,
  NavbarToggleButton
};
