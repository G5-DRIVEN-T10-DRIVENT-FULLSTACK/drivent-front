/* eslint-disable */
import styled from 'styled-components';
import { Typography } from '@material-ui/core';
import useEnrollment from '../../../hooks/api/useEnrollment';
import WarningMessage from '../../WarningMessages';
import { useState } from 'react';

export default function PaymentAndTickets() {
  const { enrollment } = useEnrollment();
  const [ticketInPerson, setTicketInPerson] = useState(false);
  const [ticketRemote, setTicketRemote] = useState(false);
  const [withoutHotel, setWithoutHotel] = useState(false);
  const [includeHotel, setIncludeHotel] = useState(false);
  const [bookButton, setBookButton] = useState(false);
  const [ticketData, setTicketData] = useState(undefined);

  if (!enrollment) {
    return <WarningMessage
      warning={'Você precisa completar sua inscrição antes de prosseguir pra escolha de ingresso'}
    />;
  }

  function handleTicketClick(type) {
    if (type === 'Presencial') {
      setTicketRemote(false);
      setTicketInPerson(true);
    } else if (type === 'Online') {
      setTicketInPerson(false);
      setTicketRemote(true);
      setWithoutHotel(false);
      setIncludeHotel(false);
    }

    if (type === 'Sem Hotel') {
      setIncludeHotel(false);
      setWithoutHotel(true);
    } else if (type === 'Com Hotel') {
      setWithoutHotel(false);
      setIncludeHotel(true);
    }
  }

  function handleBookButton(type, value) {
    setBookButton(true);
    const ticket = { type, value }
    setTicketData(ticket);
  }

  return (
    <>
      <StyledTypography variant="h4" > Ingresso e pagamento</StyledTypography>
      {bookButton ? (
        <>
          <StyledParagraph>Ingresso escolhido</StyledParagraph>
          <TicketResume>
            <Type>{ticketData.type}</Type>
            <Value>R$ {ticketData.value}</Value>
          </TicketResume>
        </>
      ) : (
        <>
          <StyledParagraph>Primeiro, escolha sua modalidade de ingresso</StyledParagraph>

          <ContainerTickets>
            <Ticket onClick={() => handleTicketClick('Presencial')} clicked={ticketInPerson}>
              <Type>Presencial</Type>
              <Value>R$ 250</Value>
            </Ticket>
            <Ticket onClick={() => handleTicketClick('Online')} clicked={ticketRemote}>
              <Type>Online</Type>
              <Value>R$ 100</Value>
            </Ticket>
          </ContainerTickets>

          {ticketInPerson && (
            <>
              <StyledParagraph>Ótimo! Agora escolha sua modalidade de hospedagem</StyledParagraph>
              <ContainerTickets>
                <Ticket onClick={() => handleTicketClick('Sem Hotel')} clicked={withoutHotel}>
                  <Type>Sem Hotel</Type>
                  <Value>+ R$ 0</Value>
                </Ticket>
                <Ticket onClick={() => handleTicketClick('Com Hotel')} clicked={includeHotel}>
                  <Type>Com Hotel</Type>
                  <Value>+ R$ 350</Value>
                </Ticket>
              </ContainerTickets>

              {withoutHotel && (
                <>
                  <StyledParagraph>Fechado! O total ficou em <StyledSpan>R$ 250</StyledSpan>. Agora é só confirmar:</StyledParagraph>
                  <StyledButton onClick={() => handleBookButton("Presencial + Sem Hotel", 250)}>RESERVAR INGRESSO</StyledButton>
                </>
              )}
              {includeHotel && (
                <>
                  <StyledParagraph>Fechado! O total ficou em <StyledSpan>R$ 600</StyledSpan>. Agora é só confirmar:</StyledParagraph>
                  <StyledButton onClick={() => handleBookButton("Presencial + Com Hotel", 600)}>RESERVAR INGRESSO</StyledButton>
                </>
              )}
            </>
          )}

          {ticketRemote && (
            <>
              <StyledParagraph>Fechado! O total ficou em <StyledSpan>R$ 100</StyledSpan>. Agora é só confirmar:</StyledParagraph>
              <StyledButton onClick={() => handleBookButton("Online", 100)}>RESERVAR INGRESSO</StyledButton>
            </>
          )}
        </>
      )
      }
    </>
  );
}

const StyledTypography = styled(Typography)`
  margin-bottom: 20px!important;
`;

const StyledParagraph = styled.p`
  font-family: 'Roboto', sans-serif;
  color: #8E8E8E;
  font-weight: 400;
  font-size: 20px;
  line-height: 23.44px;
`;

const ContainerTickets = styled.div`
  display: flex;
  margin-top: 15px;
  margin-bottom: 45px;
  gap: 25px;
  font-family: 'Roboto', sans-serif;
`;

const Ticket = styled.div`
  background-color: ${props => props.clicked ? '#FFEED2' : ''};
  width: 145px;
  height: 145px;
  border-radius: 20px;
  border: 1px solid #CECECE;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
`;

const Type = styled.p`
  color: #454545;
  font-weight: 400;
  font-size: 16px;
  line-height: 18.75px;
`;

const Value = styled.p`
  color: #898989;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.41px;
`;

const StyledSpan = styled.span`
  font-weight: 700;
`;

const StyledButton = styled.button`
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

const TicketResume = styled.div`
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