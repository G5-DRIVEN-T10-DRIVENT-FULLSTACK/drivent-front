import styled from 'styled-components';
import { Typography } from '@material-ui/core';

export const StyledTypography = styled(Typography)`
  margin-bottom: 20px!important;
`;

export const StyledParagraph = styled.p`
  font-family: 'Roboto', sans-serif;
  color: #8E8E8E;
  font-weight: 400;
  font-size: 20px;
  line-height: 23.44px;
`;

export const ContainerTickets = styled.ul`
  display: flex;
  margin-top: 15px;
  margin-bottom: 45px;
  gap: 25px;
  font-family: 'Roboto', sans-serif;
`;

export const StyledSpan = styled.span`
  font-weight: 700;
`;

export const BookingButton = styled.button`
  width: 162px;
  height: 37px;
  margin-top: 20px;
  background-color: #E0E0E0;
  box-shadow: 0px 2px 10px 0px #00000040;
  border-radius: 4px;
  border: none;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.41px;
  color: #000000;
  cursor: pointer;
`;

export const HotelTicket = styled.li`
  background-color: ${({ isSelected }) => isSelected ? '#FFEED2' : ''};
  width: 145px;
  height: 145px;
  border-radius: 20px;
  border: ${({ isSelected }) => isSelected ? '' : '1px solid #CECECE'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
`;

export const Description = styled.p`
  color: #454545;
  font-weight: 400;
  font-size: 16px;
  line-height: 18.75px;
`;

export const Price = styled.p`
  color: #898989;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.41px;
`;

export const TicketResume = styled.div`
  background-color: #FFEED2;
  width: 290px;
  height: 108px;
  border-radius: 20px;
  margin-top: 15px;
  margin-bottom: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  font-family: 'Roboto', sans-serif;
`;

export const CreditCardForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-top: 15px;
  font-family: 'Roboto', sans-serif;

  label{
      color: #A4A4A4;
      margin-top: 5px;
    }
`;

export const CreditCardContainer = styled.div`
  display: flex;
  gap: 35px;
  
  >div{
    margin: 0;
  }
`;

export const CreditCardData = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CreditCardInput = styled.input`
  width: 100%;
  height: 43px;
  border-radius: 6px;
  border: 1px solid #A4A4A4;
  ::placeholder {
    color: #A4A4A4;
  }
`;

export const CreditCardInputSeparator = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 15px;

`;

export const CreditCardName = styled(CreditCardInput)`
  margin-top: 15px;
`;

export const CreditCardValidity = styled(CreditCardInput)`
  width: 67%;
`;

export const CreditCardCVC = styled(CreditCardInput)`
  width: 30%;
`;

export const PaymentButton = styled(BookingButton)`
  width: 180px;
  margin-top: 45px;
`;

export const PaymentMessageContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  font-family: 'Roboto', sans-serif;
  padding-top: 15px;

  >svg{
    font-size: 44px;
    fill: #36B853;
  }
`;

export const PaymentMessage = styled.p`
  font-weight: 400;
  font-size: 16px;
  line-height: 18.75px;
  color: #454545;
`;

export const WarningMessageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 100%;
  font-family: 'Roboto', sans-serif;
  color: #8E8E8E;
  font-weight: 400;
  font-size: 20px;
  line-height: 23.44px;
`;
