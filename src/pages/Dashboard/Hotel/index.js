/* eslint-disable */
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import api from '../../../services/api';

function ProblemMessage({ hotelProblem }) {
  if (hotelProblem.includes('status code 401')) {
    return (
      <>
        <ProblemText>
          Sua modalidade de ingresso não inclui hospedagem Prossiga para a escolha de atividades
        </ProblemText>
      </>
    );
  }
  if (hotelProblem.includes('status code 402')) {
    return (
      <>
        <ProblemText>Você precisa ter confirmado pagamento antes de fazer a escolha de hospedagem</ProblemText>
      </>
    );
  } else {
    return <></>;
  }
}
/* eslint-disable-next-line no-console */
function HotelChoice({ hotelProblem, hotels }) {
  if (hotelProblem === 'NoError') {
    return (
      <>
        <HotelChoiceContainer>Primeiro, escolha seu hotel</HotelChoiceContainer>
        <Hotels>
          {hotels.map((h) => (
            <HotelInfoContainer key={h.id}>
              <HotelImage src={h.image} />
              <HotelName>{h.name}</HotelName>
              <HotelSubtitle>Tipos de acomodação:</HotelSubtitle>
              <HotelInfo>{h.accommodation}</HotelInfo>
              <HotelSubtitle>Vagas disponíves</HotelSubtitle>
              <HotelInfo>{h.vacanciesSum}</HotelInfo>
            </HotelInfoContainer>
          ))}
        </Hotels>
      </>
    );
  } else {
    return <></>;
  }
}
// function RoomChoice() {
//   return (
//     <>
//       <p>roomchoice</p>
//     </>
//   );
// }
// function ShowOrder() {
//   return (
//     <>
//       <p>showOrder</p>
//     </>
//   );
// }

export default function Hotel() {
  /* eslint-disable-next-line */
  const [hotelProblemKind, setHotelProblemKind] = useState('NoError');
  /* eslint-disable-next-line */
  const [hotels, setHotels] = useState([]);
  const [accommodation, setAccommodation] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  /* eslint-disable-next-line */
  const [ticketType, setTicketType] = useState('');
  async function getHotels() {
    try {
      const response = await api.get('/hotels/superGet', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDk1MTkzN30.1iNeNt7l-K4qAtWJ1VvfGdZMFR2kZeMFjXRe7c0erxs',
        },
      });
      /* eslint-disable-next-line no-console */
      console.log(response);
      /* eslint-disable-next-line no-console */

      setAccommodation(response.data.accommodation);
      setVacancies(response.data.vacancies);
      console.log('response.data.hotels', response.data.hotels);
      console.log('response.data.accommodation', response.data.accommodation);
      console.log('response.data.vacancies', response.data.vacancies);
      return setHotels(response.data.hotels);
    } catch (error) {
      // /* eslint-disable-next-line no-console */
      // console.log(error);
      // /* eslint-disable-next-line no-console */
      // console.log(error.message);
      return setHotelProblemKind(error.message);
    }

    // const error = response.catch(() => {
    //   /* eslint-disable-next-line no-console */
    //   console.log(error);
    // });
    // /* eslint-disable-next-line no-console */
    // console.log(response);
    // /* eslint-disable-next-line no-console */
    // console.log(response);
  }

  async function isRemoteFunc() {
    try {
      const response = await api.get('/tickets/types', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDk1MTkzN30.1iNeNt7l-K4qAtWJ1VvfGdZMFR2kZeMFjXRe7c0erxs',
        },
      });
      // /* eslint-disable-next-line no-console */
      // console.log('isRemoteFunc', response.data[0].isRemote);
      if (response.data[0].isRemote === true) {
        return setHotelProblemKind('status code 402');
      }
      return setTicketType(response.data);
    } catch (error) {
      // /* eslint-disable-next-line no-console */
      // console.log(error);
      /* eslint-disable-next-line no-console */
      console.log(error.message);
      // return setTicketType(error.message);
    }

    // const error = response.catch(() => {
    //   /* eslint-disable-next-line no-console */
    //   console.log(error);
    // });
    // /* eslint-disable-next-line no-console */
    // console.log(response);
    // /* eslint-disable-next-line no-console */
    // console.log(response);
  }

  useEffect(() => {
    //Runs only on the first render
    getHotels();
    isRemoteFunc();
  }, []);

  return (
    <>
      <StyledTypography variant="h4">Escolha de hotel e quarto</StyledTypography>
      <HotelContent>
        {/* <ProblemMessage hotelProblem={hotelProblemKind} /> */}
        <ProblemMessage hotelProblem={hotelProblemKind} />
        <HotelChoice hotels={hotels} hotelProblem={hotelProblemKind} />
      </HotelContent>

      {/* <RoomChoice />
      <ShowOrder /> */}
    </>
  );
}

const StyledTypography = styled(Typography)`
  margin-bottom: 20px !important;
`;

const ProblemText = styled.p`
  color: #8e8e8e;
  width: 550px;
  word-break: break-word;
  text-align: center;
  font-size: 20px;
  font-weight: 400;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HotelContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  position: relative;
`;

const HotelChoiceContainer = styled.div`
  position: absolute;
  display: flex;
  color: #8e8e8e;
  font-size: 20px;
  font-weight: 400;
  top: 0px;
  left: 0px;
`;

const HotelInfoContainer = styled.div`
  width: 196px;
  height: 264px;
  background-color: #ebebeb;
  border-radius: 20px;
  margin-right: 20px;
  margin-top: 33px;
  padding: 15px;
  /* display: flex;
  flex-direction: column; */
`;

const Hotels = styled.div`
  /* width: 196px;
  height: 264px;
  background-color: #ebebeb;
  border-radius: 20px; */
  position: absolute;
  top: 0px;
  left: 0px;
  display: flex;
  flex-wrap: wrap;
`;

const HotelImage = styled.img`
  width: 168px;
  height: 109px;
  border-radius: 5px;
`;

const HotelName = styled.h1`
  font-size: 20px;
  font-weight: 400;
  margin-top: 15px;
`;

const HotelSubtitle = styled.h2`
  font-size: 12px;
  font-weight: 700;
  margin-top: 15px;
  margin-bottom: 5px;
`;

const HotelInfo = styled.h3`
  font-size: 12px;
  font-weight: 400;
`;
