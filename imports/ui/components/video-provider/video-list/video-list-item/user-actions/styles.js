import styled from 'styled-components';
import { colorOffWhite,colorTransparent } from '/imports/ui/stylesheets/styled-components/palette';
import { TextElipsis, DivElipsis } from '/imports/ui/stylesheets/styled-components/placeholders';
import { landscape, mediumUp } from '/imports/ui/stylesheets/styled-components/breakpoints';
import Button from '/imports/ui/components/common/button/component';

const DropdownTrigger = styled(DivElipsis)`
  position: relative;
  // Keep the background with 0.5 opacity, but leave the text with 1
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1px;
  color: ${colorOffWhite};
  padding: 0 1rem 0 .5rem !important;
  font-size: 80%;
  cursor: pointer;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;

  &::after {
    content: "\\203a";
    position: absolute;
    transform: rotate(90deg);
    top: 45%;
    width: 0;
    line-height: 0;
    right: .45rem;
  }
`;

const UserName = styled(TextElipsis)`
  position: relative;
  max-width: 75%;
  // Keep the background with 0.5 opacity, but leave the text with 1
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1px;
  color: ${colorOffWhite};
  padding: 0 1rem 0 .5rem !important;
  font-size: 80%;

  ${({ noMenu }) => noMenu && `
    padding: 0 .5rem 0 .5rem !important;
  `}
`;

const Dropdown = styled.div`
  display: flex;
  outline: none !important;
  width: 70%;

  @media ${mediumUp} {
    >[aria-expanded] {
      padding: .25rem;
    }
  }

  @media ${landscape} {
    button {
      width: calc(100vw - 4rem);
      margin-left: 1rem;
    }
  }

  ${({ isFirefox }) => isFirefox && `
    max-width: 100%;
  `}
`;

const MenuWrapper = styled.div`
  max-width: 75%;
`;

const CommonButton = styled(Button)`
    margin-right:5px;
    background-color: rgba(0,0,0,.4) !important;
    border: none !important;
    // &:active,
    // &:hover,
    // &:focus {
    //   background-color: ${colorTransparent} !important;
    //   border: none !important;

    //   i {
    //     border: none !important;
    //     background-color: ${colorTransparent} !important;
    //   }
    // }
    padding: 5px;
    margin-top: 2px;

    &:hover {
      border: 0;
    }

    svg {
      font-size: 1.4rem;
      color: var(--color-white,#FFF);
    }
`;

export default {
  DropdownTrigger,
  UserName,
  Dropdown,
  MenuWrapper,
  CommonButton
};
