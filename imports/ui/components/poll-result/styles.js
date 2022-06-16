import styled from 'styled-components';
import Button from '/imports/ui/components/common/button/component';
import {
  smPaddingX,
  smPaddingY,
  lgPaddingX,
  borderRadius,
  mdPaddingY,
  borderSize,
  borderSizeLarge,
  pollInputHeight,
  pollSmMargin,
  pollMdMargin,
  pollHeaderOffset,
} from '/imports/ui/stylesheets/styled-components/general';
import {
  colorText,
  colorBlueLight,
  colorGray,
  colorGrayLight,
  colorGrayLighter,
  colorGrayLightest,
  colorDanger,
  colorHeading,
  colorPrimary,
  colorGrayDark,
  colorWhite,
  pollBlue,
} from '/imports/ui/stylesheets/styled-components/palette';
import { fontSizeBase, fontSizeSmall } from '/imports/ui/stylesheets/styled-components/typography';
import Modal from '/imports/ui/components/common/modal/simple/component';

const PollModal = styled(Modal)`
    padding: 0.75rem ;

    ${({ small }) => small && `
        max-width: 70vw!important;
    `}
`;


export default {
    PollModal,
}