import { useContext, useEffect, useState } from 'react';
import UserContext from '../../../contexts/UserContext';
import * as ticketApi from '../../../services/ticketApi';
import { getPersonalInformations } from '../../../services/enrollmentApi';
import { paymentProcess } from '../../../services/paymentApi';
import TicketType from '../../../components/TicketTypeItem';
import {
  BookingButton,
  ContainerTickets,
  CreditCardCVC,
  CreditCardContainer,
  CreditCardData,
  CreditCardForm,
  CreditCardInput,
  CreditCardInputSeparator,
  CreditCardName,
  CreditCardValidity,
  Description,
  HotelTicket,
  PaymentButton,
  PaymentMessage,
  PaymentMessageContainer,
  Price,
  StyledParagraph,
  StyledSpan,
  StyledTypography,
  TicketResume,
  WarningMessageContainer
} from './style';
import { toast } from 'react-toastify';
import Cards from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { BsCheckCircleFill } from 'react-icons/bs';

export default function Payment() {
  const { userData } = useContext(UserContext);
  const [enrollment, setEnrollment] = useState(null);
  const [userTicket, setUserTicket] = useState(null);
  const [ticketType, setTicketType] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(false);
  const [hotel, setHotel] = useState({ option: null, value: null });
  const [ticketIsBooked, setTicketIsBooked] = useState(false);
  const [userBookedTicket, setUserBookedTicket] = useState(null);
  const [isTicketPaid, setIsTicketPaid] = useState(false);
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '',
  });

  useEffect(() => {
    getUserEnrollment();
    verifyUserTicket();
    getTicketTypes();
  }, []);

  async function getUserEnrollment() {
    try {
      const data = await getPersonalInformations(userData.token);
      setEnrollment(data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  async function getTicketTypes() {
    try {
      const data = await ticketApi.getTicketTypes(userData.token);
      setTicketType(data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  async function verifyUserTicket() {
    try {
      const data = await ticketApi.getTicketByUser(userData.token);
      setUserTicket(data);
    } catch (err) {
      console.log(err.response.data);
    }
  }

  async function handleTicketBooking(ticketTypeId) {
    const ticketWithHotel = ticketType.filter(t => t.includesHotel === true);

    try {
      const data = await ticketApi.bookTicket(userData.token, hotel.option === true ? ticketWithHotel[0]?.id : ticketTypeId);
      toast('Ingresso reservado com sucesso!');
      setUserBookedTicket(data);
      setTicketIsBooked(true);
    } catch (err) {
      toast('Você já possui uma reserva em aberto!');
    }
  }

  async function finishPayment(e) {
    e.preventDefault();

    try {
      const cardParams = {
        issuer: cardData.name,
        number: cardData.number,
        name: cardData.name,
        expirationDate: cardData.expiry,
        cvv: cardData.cvc
      };

      const body = {
        ticketId: userTicket ? userTicket.id : userBookedTicket.id,
        cardData: cardParams
      };

      const data = await paymentProcess(userData.token, body);
      toast('Ingresso pago com sucesso!');
      setIsTicketPaid(true);
    } catch (err) {
      console.log(err);
    }
  }

  function handleHotelOption(option) {
    setHotel(option);
  }

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;

    setCardData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setCardData((prev) => ({ ...prev, focus: evt.target.name }));
  };

  return (
    <>
      <StyledTypography variant="h4" > Ingresso e pagamento</StyledTypography>
      {ticketIsBooked || userTicket ?
        <>
          <StyledParagraph>Ingresso escolhido</StyledParagraph>
          {selectedTicket.name === 'Online' || userTicket?.TicketType.name === 'Online' ?
            <TicketResume>
              <Description>{`${userTicket ? userTicket.TicketType.name : selectedTicket.name}`}</Description>
              <Price>{`R$ ${userTicket ? userTicket.TicketType.price : selectedTicket.price}`}</Price>
            </TicketResume>
            :
            <TicketResume>
              <Description>{`${userTicket?.TicketType ? userTicket.TicketType.name : selectedTicket.name} + ${hotel.option === true || userTicket?.TicketType.includesHotel === true ? 'Com Hotel' : 'Sem Hotel'}`}</Description>
              <Price>{`R$ ${userTicket?.TicketType ? userTicket.TicketType.price : selectedTicket.price + hotel.value}`}</Price>
            </TicketResume>
          }

          <StyledParagraph>Pagamento</StyledParagraph>
          {isTicketPaid || userTicket?.status === 'PAID' ?
            <PaymentMessageContainer>
              <BsCheckCircleFill />
              <PaymentMessage><StyledSpan>Pagamento confirmado!</StyledSpan> <br />Prossiga para escolha de hospedagem e atividades</PaymentMessage>
            </PaymentMessageContainer>
            :
            <>
              <CreditCardForm onSubmit={finishPayment}>
                <CreditCardContainer>
                  <Cards
                    number={cardData.number}
                    expiry={cardData.expiry}
                    cvc={cardData.cvc}
                    name={cardData.name}
                    focused={cardData.focus}
                  />
                  <CreditCardData>
                    <CreditCardInput
                      type="text"
                      name="number"
                      placeholder="Card Number"
                      maxLength="16"
                      pattern="[0-9]{16}"
                      value={cardData.number}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      required
                      title="Por favor, insira um número de cartão válido com 16 dígitos."
                    />
                    <label>E.g.: 49..., 51... 36... 37...</label>

                    <CreditCardName
                      type="text"
                      name="name"
                      placeholder="Name"
                      pattern="[A-Za-zÀ-ÖØ-öø-ÿ\s]*"
                      value={cardData.name}
                      onChange={handleInputChange}
                      onFocus={handleInputFocus}
                      required
                      title="Por favor, insira um nome válido apenas com letras e espaços."
                    />
                    <CreditCardInputSeparator>
                      <CreditCardValidity
                        type="text"
                        name="expiry"
                        placeholder="Valid Thru"
                        maxLength="4"
                        pattern="[0-9]*"
                        value={cardData.expiry}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        required
                        title="Por favor, insira uma data de validade válida com 4 dígitos numéricos."
                      />

                      <CreditCardCVC
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        maxLength="3"
                        pattern="[0-9]*"
                        value={cardData.cvc}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        required
                        title="Por favor, insira um código CVC válido com 3 dígitos numéricos."
                      />
                    </CreditCardInputSeparator>
                  </CreditCardData>
                </CreditCardContainer>
                <PaymentButton type='submit'>FINALIZAR PAGAMENTO</PaymentButton>
              </CreditCardForm>
            </>
          }
        </>
        :
        <>
          {!enrollment ?
            <WarningMessageContainer>Você precisa completar sua inscrição antes<br />de prosseguir pra escolha de ingresso</WarningMessageContainer>
            :
            <>
              <StyledParagraph>Primeiro, escolha sua modalidade de ingresso</StyledParagraph>
              <ContainerTickets>
                {ticketType.map(t => {
                  if ((t.isRemote === false && t.includesHotel === false) || (t.isRemote === true)) {
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
                  }
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

                  {!selectedTicket.isRemote && !selectedTicket.includesHotel ?
                    <>
                      <ContainerTickets>
                        <HotelTicket onClick={() => handleHotelOption({ option: false, value: 0 })} isSelected={hotel.option === false}>
                          <Description>Sem Hotel</Description>
                          <Price>{'+ R$ 0'}</Price>
                        </HotelTicket>

                        <HotelTicket onClick={() => handleHotelOption({ option: true, value: 350 })} isSelected={hotel.option === true}>
                          <Description>Com Hotel</Description>
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
