import styled from 'styled-components';
import {
  colorWhite,
  colorGrayDark,
} from '/imports/ui/stylesheets/styled-components/palette';
import { smallOnly } from '/imports/ui/stylesheets/styled-components/breakpoints';
import Button from '/imports/ui/components/common/button/component';
import {
  mdPaddingX,
  mdPaddingY,
  pollHeaderOffset,
  borderSizeLarge,
  borderSize,
} from '/imports/ui/stylesheets/styled-components/general';
import { DivElipsis } from '/imports/ui/stylesheets/styled-components/placeholders';

const Chat = styled.div`
  background-color: #161616; 
  // ${colorGrayDark};
  padding: ${mdPaddingX} ${mdPaddingY} ${mdPaddingX} ${mdPaddingX};
  // box-shadow: -1px 5px 2px 1px #fff;
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-around;
  overflow: hidden;
  height: 100%;
  // border-top: 1px solid #fff;

  ${({ isChrome }) => isChrome && `
    transform: translateZ(0);
  `}

  @media ${smallOnly} {
    transform: none !important;
  }
`;

const Header = styled.header`
  position: relative;
  top: ${pollHeaderOffset};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled(DivElipsis)`
  flex: 1;

  & > button, button:hover {
    max-width: 98%;
  }
`;

const PrivateChatButton = styled(Button)`
 //color: ${colorWhite};
}`;

const HideChatButton = styled.span`//styled(Button)\`
  // position: relative;
  // // background-color: ${colorWhite};
  // // color: ${colorWhite};
  // display: block;
  // margin: ${borderSizeLarge};
  // margin-bottom: ${borderSize};
  // // padding-left: 0;
  // // padding-right: inherit;
  // z-index: 3;

  // [dir="rtl"] & {
  //   padding-left: inherit;
  //   padding-right: 0;
  // }

  // & > i {
  //     color: ${colorGrayDark};
  //     font-size: smaller;

  //     [dir="rtl"] & {
  //       -webkit-transform: scale(-1, 1);
  //       -moz-transform: scale(-1, 1);
  //       -ms-transform: scale(-1, 1);
  //       -o-transform: scale(-1, 1);
  //       transform: scale(-1, 1);
  //     }
  // }

  // &:hover {
  //     // background-color: ${colorWhite};
  // }
  width: 50%;
  background-color: transparent;
  color: #fff;
  text-align: center;
  padding: 5px;
  // font-size: 2em;
  cursor: pointer;
`;

export default {
  Chat,
  Header,
  Title,
  HideChatButton,
  PrivateChatButton
};
