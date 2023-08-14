import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export const StyledTypography = styled(Typography)`
  margin-bottom: 20px !important;
`;

export const StyledParagraph = styled.p`
  font-family: 'Roboto', sans-serif;
  color: #8e8e8e;
  font-weight: 400;
  font-size: 20px;
  line-height: 23.44px;
`;

export const DayBox = styled.div`
  width: 131px;
  height: 37px;
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 4px;
  background: ${({ selected }) => (selected ? '#FFD37D' : '#e0e0e0')};
  box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.25);
  :hover {
    cursor: pointer;
  }

  color: #000;
  text-align: center;
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
`;
