/* eslint-disable */
import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import * as ticketApi from '../../../services/ticketApi';
import { getPersonalInformations } from '../../../services/enrollmentApi';
import TicketType from '../../../components/TicketTypeItem';
import WarningMessage from '../../../components/WarningMessages';
import { BookingButton, ContainerTickets, Description, HotelTicket, Price, StyledParagraph, StyledSpan, StyledTypography, TicketResume } from './style';
import { toast } from 'react-toastify';

export default function Payment() {
  const { userData } = useContext(UserContext);
  const [enrollment, setEnrollment] = useState(null);
  const [ticketType, setTicketType] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(false);
  const [hotel, setHotel] = useState({ option: null, value: null });
  const [ticketIsBooked, setTicketIsBooked] = useState(false);

  useEffect(() => {
    getUserEnrollment();
    getTicketTypes();
  }, []);

  async function getUserEnrollment() {
    try {
      const data = await getPersonalInformations(userData.token);
      setEnrollment(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function getTicketTypes() {
    try {
      const data = await ticketApi.getTicketTypes(userData.token);
      setTicketType(data);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleTicketBooking(ticketTypeId) {
    try {
      await ticketApi.bookTicket(userData.token, ticketTypeId);
      toast('Ingresso reservado com sucesso!');
      setTicketIsBooked(true);
    } catch (err) {
      toast('Você já possui uma reserva em aberto!')
    }
  }

  function handleHotelOption(option) {
    setHotel(option);
  }

  return (
    <>
      <StyledTypography variant="h4" > Ingresso e pagamento</StyledTypography>
      {ticketIsBooked ?
        <>
          <StyledParagraph>Ingresso escolhido</StyledParagraph>
          {selectedTicket.name === 'Online' ?
            <TicketResume>
              <Description>{`${selectedTicket.name}`}</Description>
              <Price>{`R$ ${selectedTicket.price}`}</Price>
            </TicketResume>
            :
            <TicketResume>
              <Description>{`${selectedTicket.name} + ${hotel.option}`}</Description>
              <Price>{`R$ ${selectedTicket.price + hotel.value}`}</Price>
            </TicketResume>
          }
          <StyledParagraph>Pagamento</StyledParagraph>
          {/*TODO: Implementar fluxo de pagamento do ingresso*/}
        </>
        :
        <>
          {!enrollment ?
            <WarningMessage warning={'Você precisa completar sua inscrição antes de prosseguir pra escolha de ingresso'} />
            :
            <>
              <StyledParagraph>Primeiro, escolha sua modalidade de ingresso</StyledParagraph>
              <ContainerTickets>
                {ticketType.map(t => {
                  return (
                    <TicketType
                      key={t.id}
                      name={t.name}
                      price={t.price}
                      currentTicket={t}
                      selectedTicket={selectedTicket}
                      setSelectedTicket={setSelectedTicket}
                    />
                  );
                })}
              </ContainerTickets>

              {selectedTicket ?
                <>
                  {!selectedTicket.isRemote || selectedTicket.includesHotel ?
                    <StyledParagraph>Ótimo! Agora escolha sua modalidade de hospedagem</StyledParagraph>
                    :
                    <>
                      <StyledParagraph>Fechado! O total ficou em <StyledSpan>{`R$ ${selectedTicket.price}`}</StyledSpan>. Agora é só confirmar:</StyledParagraph>
                      <BookingButton onClick={() => handleTicketBooking(selectedTicket.id)}>RESERVAR INGRESSO</BookingButton>
                    </>
                  }

                  {!selectedTicket.isRemote && selectedTicket.includesHotel ?
                    <>
                      <ContainerTickets>
                        <HotelTicket onClick={() => handleHotelOption({ option: 'Sem Hotel', value: 0 })} isSelected={hotel.option === 'Sem Hotel'}>
                          <Description>Sem Hotel</Description>
                          <Price>{'+ R$ 0'}</Price>
                        </HotelTicket>

                        <HotelTicket onClick={() => handleHotelOption({ option: 'Com Hotel', value: 350 })} isSelected={hotel.option === 'Com Hotel'}>
                          <Description>Sem Hotel</Description>
                          <Price>{'+ R$ 350'}</Price>
                        </HotelTicket>
                      </ContainerTickets>

                      {hotel.option !== null && hotel.value !== null ?
                        <>
                          <StyledParagraph>Fechado! O total ficou em <StyledSpan>{`R$ ${selectedTicket.price + hotel.value}`}</StyledSpan>. Agora é só confirmar:</StyledParagraph>
                          <BookingButton onClick={() => handleTicketBooking(selectedTicket.id)}>RESERVAR INGRESSO</BookingButton>
                        </>
                        : ''
                      }
                    </>
                    : ''
                  }
                </>
                : ''
              }
            </>
          }
        </>
      }
    </>
  );
}
