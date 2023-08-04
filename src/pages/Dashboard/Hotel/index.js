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
function HotelChoice({ hotelProblem, hotels }) {
  const [hotelClickedStates, setHotelClickedStates] = useState({});

  useEffect(() => {
    // Inicialize o objeto de estados vazio
    const initialClickedStates = {};
    hotels.forEach((hotel) => {
      initialClickedStates[hotel.id] = false;
    });
    setHotelClickedStates(initialClickedStates);
    console.log('initialClickedStates', initialClickedStates);
  }, [hotels]);

  const handleContainerClick = (hotelId) => {
    const newObject = {};
    console.log(hotelId);
    console.log('hotelClickedStates', hotelClickedStates);

    for (const key in hotelClickedStates) {
      if (Number(key) !== Number(hotelId)) {
        // console.log('hotelClickedStates[Number(hotelId)]', hotelClickedStates[Number(key)]);
        newObject[Number(key)] = false
        // console.log('===========', key);
      } else {
        newObject[Number(key)] = !hotelClickedStates[Number(hotelId)];
        // console.log('hotelClickedStates[Number(hotelId)]', hotelClickedStates[Number(hotelId)]);
        // console.log('!!!!!!!!!!!', key);
      }
    }
    setHotelClickedStates(newObject);

    // setHotelClickedStates((hotelClickedStates) => ({
    //   ...hotelClickedStates,
    //   [hotelId]: !hotelClickedStates[hotelId],
    // }));
    console.log(newObject);
  };

  if (hotelProblem === 'NoError') {
    return (
      <>
        <HotelChoiceContainer>Primeiro, escolha seu hotel</HotelChoiceContainer>
        <Hotels>
          {hotels.map((h) => (
            <HotelInfoContainer
              clicked={hotelClickedStates[h.id]}
              onClick={() => handleContainerClick(h.id)}
              key={h.id}
            >
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

export default function Hotel() {
  const [hotelProblemKind, setHotelProblemKind] = useState('NoError');
  const [hotels, setHotels] = useState([]);
  const [accommodation, setAccommodation] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [ticketType, setTicketType] = useState('');
  async function getHotels() {
    try {
      const response = await api.get('/hotels/superGet', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDk1MTkzN30.1iNeNt7l-K4qAtWJ1VvfGdZMFR2kZeMFjXRe7c0erxs',
        },
      });

      setAccommodation(response.data.accommodation);
      setVacancies(response.data.vacancies);
      console.log('response.data.hotels', response.data.hotels);
      console.log('response.data.accommodation', response.data.accommodation);
      console.log('response.data.vacancies', response.data.vacancies);
      return setHotels(response.data.hotels);
    } catch (error) {
      return setHotelProblemKind(error.message);
    }
  }

  async function isRemoteFunc() {
    try {
      const response = await api.get('/tickets/types', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDk1MTkzN30.1iNeNt7l-K4qAtWJ1VvfGdZMFR2kZeMFjXRe7c0erxs',
        },
      });
      if (response.data[0].isRemote === true) {
        return setHotelProblemKind('status code 402');
      }
      return setTicketType(response.data);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error.message);
    }
  }

  useEffect(() => {
    getHotels();
    isRemoteFunc();
  }, []);

  return (
    <>
      <StyledTypography variant="h4">Escolha de hotel e quarto</StyledTypography>
      <HotelContent>
        <ProblemMessage hotelProblem={hotelProblemKind} />
        <HotelChoice hotels={hotels} hotelProblem={hotelProblemKind} />
      </HotelContent>
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
  background-color: ${(props) => (props.clicked ? '#FFEED2' : '#ebebeb')};
  border-radius: 20px;
  margin-right: 20px;
  margin-top: 33px;
  padding: 15px;
`;

const Hotels = styled.div`
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
