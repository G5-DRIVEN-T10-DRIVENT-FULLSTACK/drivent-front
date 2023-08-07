/* eslint-disable */
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState, Fragment } from 'react';
import api from '../../../services/api';
import { BsPerson, BsPersonFill } from 'react-icons/bs';
import UserContext from '../../../contexts/UserContext';
import { useContext } from 'react';

function RoomsHeadingTitle({ showRooms, hotelClickedStates, vacancies }) {
  // console.log('hotelClickedStates', hotelClickedStates);
  // console.log(Object.keys(hotelClickedStates).find((hotelId) => hotelClickedStates[hotelId] === true));
  // console.log('showRooms', showRooms);

  if (showRooms) {
    const hotelId = Object.keys(hotelClickedStates).find((hotelId) => hotelClickedStates[hotelId] === true);
    // console.log('hotelId', hotelId);
    console.log('vacancies', vacancies);
    console.log('vacancies.capacity', vacancies.capacity);
    const hotelsIdArrays = vacancies.hotelIdArray;
    // console.log('hotelsIdArrays', hotelsIdArrays);
    // console.log('hotelId', hotelId);
    const roomsKeys = Object.keys(hotelsIdArrays).filter((key) => Number(hotelsIdArrays[key]) === Number(hotelId));
    console.log('roomsKeys', roomsKeys);
    const choisenRoom = true;
    const fullRoom = true;

    function renderIcon(cap) {
      for (let i = 0; i < cap; i++) {
        return (
          <>
            <BsPerson size={30} />
          </>
        );
      }
    }

    return (
      <>
        <RoomChoice>
          <RoomsHeadingTitleStyle>Ótima pedida! Agora escolha seu quarto:</RoomsHeadingTitleStyle>
          <AllRoomsContainer>
            {/* {roomsKeys.map((roomId) => (
              <RoomContainer key={roomId}>
                <RoomInfo>
                  <RoomId fullRoom={fullRoom}>{roomId}</RoomId>
                  <RoomIcons>{renderIcon(vacancies.capacity[roomId])}</RoomIcons>
                </RoomInfo>
              </RoomContainer>
            ))} */}
            <RoomContainer fullRoom={true}>
              <RoomInfo>
                <RoomId fullRoom={fullRoom}>101</RoomId>
                <RoomIcons>
                  {choisenRoom ? (
                    <BsPersonFill size={30} color={fullRoom ? '#8C8C8C' : '#000000'} />
                  ) : (
                    <BsPerson size={30} />
                  )}
                  {choisenRoom ? (
                    <BsPersonFill size={30} color={fullRoom ? '#8C8C8C' : '#000000'} />
                  ) : (
                    <BsPerson size={30} />
                  )}
                  {choisenRoom ? (
                    <BsPersonFill size={30} color={fullRoom ? '#8C8C8C' : '#000000'} />
                  ) : (
                    <BsPerson size={30} />
                  )}
                </RoomIcons>
              </RoomInfo>
            </RoomContainer>
            <RoomContainer fullRoom={fullRoom}>
              <RoomInfo>
                <RoomId fullRoom={fullRoom}>101</RoomId>
                <RoomIcons>
                  {choisenRoom ? (
                    <BsPersonFill size={30} color={fullRoom ? '#8C8C8C' : '#000000'} />
                  ) : (
                    <BsPerson size={30} />
                  )}
                  {choisenRoom ? (
                    <BsPersonFill size={30} color={fullRoom ? '#8C8C8C' : '#000000'} />
                  ) : (
                    <BsPerson size={30} />
                  )}
                  {choisenRoom ? (
                    <BsPersonFill size={30} color={fullRoom ? '#8C8C8C' : '#000000'} />
                  ) : (
                    <BsPerson size={30} />
                  )}
                </RoomIcons>
              </RoomInfo>
            </RoomContainer>
          </AllRoomsContainer>
        </RoomChoice>
      </>
    );
  } else {
    return <></>;
  }
}

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
function HotelChoice({ hotelProblem, hotels, vacancies }) {
  const [hotelClickedStates, setHotelClickedStates] = useState({});
  const [showRooms, setShowRooms] = useState(false);

  useEffect(() => {
    // Inicialize o objeto de estados vazio
    const initialClickedStates = {};
    hotels.forEach((hotel) => {
      initialClickedStates[hotel.id] = false;
    });
    setHotelClickedStates(initialClickedStates);
    // console.log('initialClickedStates', initialClickedStates);
  }, [hotels]);

  const handleContainerClick = (hotelId) => {
    const newObject = {};
    // console.log(hotelId);
    // console.log('hotelClickedStates', hotelClickedStates);

    for (const key in hotelClickedStates) {
      if (Number(key) !== Number(hotelId)) {
        newObject[Number(key)] = false;
      } else {
        newObject[Number(key)] = !hotelClickedStates[Number(hotelId)];
      }
    }
    setHotelClickedStates(newObject);
    setShowRooms(!!Object.keys(newObject).filter((ch) => newObject[ch] === true).length);
    // console.log(showRooms);
    // console.log(newObject);
  };

  if (hotelProblem === 'NoError') {
    console.log(hotels);
    return (
      <>
        <HotelChoiceContainer>Primeiro, escolha seu hotel</HotelChoiceContainer>
        <HotelsContainer>
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
          <RoomsHeadingTitle showRooms={showRooms} hotelClickedStates={hotelClickedStates} vacancies={vacancies} />
        </HotelsContainer>
      </>
    );
  } else {
    return <></>;
  }
}

export default function Hotel() {
  const { userData } = useContext(UserContext);
  const [hotelProblemKind, setHotelProblemKind] = useState('NoError');
  const [hotels, setHotels] = useState([]);
  const [accommodations, setAccommodation] = useState({});
  const [vacancies, setVacancies] = useState([]);
  const [ticketType, setTicketType] = useState('');
  async function getHotels() {
    try {
      const response = await api.get('/hotels/superGet', {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      // console.log(response.data.accommodation);
      console.log(response.data);
      const roomsObject = response.data.rooms;
      const vacanciesObject = response.data.vacancies;

      const capacityArray = roomsObject.reduce((acc, room) => {
        acc.push(room.capacity);
        return acc;
      }, []);
      vacanciesObject.capacity = capacityArray;
      // console.log(vacanciesObject);

      setAccommodation(response.data.accommodation);
      setVacancies(vacanciesObject);

      // console.log('response.data.hotels', response.data.hotels);
      // console.log('response.data.hotels', response.data.hotels);
      // console.log('response.data.accommodation', response.data.accommodation);
      // console.log('response.data.vacancies', response.data.vacancies);
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
        <HotelChoice hotels={hotels} hotelProblem={hotelProblemKind} vacancies={vacancies} />
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

const HotelsContainer = styled.div`
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

const Hotels = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RoomsHeadingTitleStyle = styled.p`
  color: #8e8e8e;
  font-size: 20px;
  font-weight: 400;
  margin-top: 50px;
  margin-bottom: 30px;
`;

const RoomContainer = styled.div`
  /* background-color: ; */
  width: 190px;
  height: 45px;
  border: solid 1px #cecece;
  border-radius: 5px;
  margin-right: 15px;
  margin-bottom: 5px;
  /* color: ${(props) => (props.fullRoom ? '#e9e9e9' : '#454545')}; */
  ${(props) => (props.fullRoom ? 'background-color: #e9e9e9;' : '')}
`;

const RoomChoice = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
`;

const AllRoomsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const RoomId = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: ${(props) => (props.fullRoom ? '#9d9d9d' : '#454545')};
`;

const RoomIcons = styled.div`
  display: flex;
`;
const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 5px;
`;
