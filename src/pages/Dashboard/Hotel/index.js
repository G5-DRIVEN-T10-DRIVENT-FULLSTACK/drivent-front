/* eslint-disable */
import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState, Fragment } from 'react';
import api from '../../../services/api';
import { BsPerson, BsPersonFill } from 'react-icons/bs';
import UserContext from '../../../contexts/UserContext';
import { useContext } from 'react';
import * as ticketApi from '../../../services/ticketApi';
import Button from '../../../components/Form/Button';

function choiceRoomFunction(hotelId, roomId, setRoomIdToBack) {
  console.log('hotelId', hotelId);
  console.log('roomId', roomId);
  const sendableRoomId = roomId;
  setRoomIdToBack({ roomId: sendableRoomId });
}

function RoomsHeadingTitle({ showRooms, hotelClickedStates, vacancies }) {
  // console.log('hotelClickedStates', hotelClickedStates);
  // console.log(Object.keys(hotelClickedStates).find((hotelId) => hotelClickedStates[hotelId] === true));
  // console.log('showRooms', showRooms);
  const [roomIdToBack, setRoomIdToBack] = useState({});

  if (showRooms) {
    const hotelId = Object.keys(hotelClickedStates).find((hotelId) => hotelClickedStates[hotelId] === true);
    // console.log('hotelId', hotelId);
    let hotelRoomsInfo = [];
    console.log('vacancies', vacancies);
    console.log('vacancies.capacity', vacancies.capacity);
    const hotelsIdArrays = vacancies.hotelIdArray;
    // console.log('hotelsIdArrays', hotelsIdArrays);
    // console.log('hotelId', hotelId);
    const roomsKeys = Object.keys(hotelsIdArrays).filter((key) => Number(hotelsIdArrays[key]) === Number(hotelId));
    // const testArray = roomsKeys;
    hotelRoomsInfo = roomsKeys.map((ta, index) => {
      console.log(roomIdToBack === ta);
      console.log('roomIdToBack', roomIdToBack);
      console.log('ta', ta);
      return {
        id: ta,
        totalCapacity: vacancies.capacity[ta],
        availableCapacity: vacancies.hotelVacanciesArray[ta],
        choisen: roomIdToBack.roomId === ta ? true : false,
      };
    });
    console.log('hotelRoomsInfo', hotelRoomsInfo);
    // console.log('testArray', testArray);
    return (
      <>
        <RoomChoice>
          <RoomsHeadingTitleStyle>Ótima pedida! Agora escolha seu quarto:</RoomsHeadingTitleStyle>
          <AllRoomsContainer>
            {hotelRoomsInfo.map((hri, index) => {
              const personIcons = [];
              for (let i = 0; i < hri.totalCapacity; i++) {
                if (hri.totalCapacity === hri.availableCapacity) {
                  personIcons.push(<BsPerson key={i} size={30} />);
                } else {
                  if (hri.availableCapacity - i) {
                    personIcons.push(<BsPerson key={i} size={30} />);
                  } else {
                    personIcons.push(
                      <BsPersonFill key={i} size={30} color={!hri.availableCapacity ? '#8C8C8C' : '#000000'} />
                    );
                  }
                  ///cap = 3; av = 3;
                  ///av - i = 3 2 1
                  ///cap = 3; av = 2;
                  ///av - i = 2 1 0
                  ///cap = 3; av = 1;
                  ///av - i = 1 0 -1
                  ///cap = 3; av = 0;
                  ///av - i = 0 -1 -2
                  ///
                  // personIcons.push(
                  //   choisenRoom ? (
                  //     <BsPersonFill
                  //       key={i}
                  //       size={30}
                  //       color={hri.totalCapacity - hri.availableCapacity ? '#8C8C8C' : '#000000'}
                  //     />
                  //   ) : (
                  //     <BsPerson key={i} size={30} />
                  //   )
                  // );
                }
              }
              return (
                <RoomContainer
                  onClick={() => choiceRoomFunction(hotelId, hri.id, setRoomIdToBack)}
                  key={hri.id}
                  fullRoom={!hri.availableCapacity}
                  chosen={hri.choisen}
                >
                  <RoomInfo>
                    <RoomId fullRoom={!hri.availableCapacity}>{index + 1}</RoomId>
                    <RoomIcons>{personIcons}</RoomIcons>
                  </RoomInfo>
                </RoomContainer>
              );
            })}
          </AllRoomsContainer>
          <SubmitContainer>
            <Button>RESERVAR QUARTO</Button>
          </SubmitContainer>
        </RoomChoice>
      </>
    );
  } else {
    return <></>;
  }
}

function ProblemMessage({ hotelProblem }) {
  if (hotelProblem.includes('status code 401') || hotelProblem.includes('online')) {
    return (
      <>
        <ProblemText>
          Sua modalidade de ingresso não inclui hospedagem Prossiga para a escolha de atividades
        </ProblemText>
      </>
    );
  }
  if (hotelProblem.includes('status code 402') || hotelProblem.includes('status code 400')) {
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
    console.log('hotels', hotels);
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
  const [ticketType, setTicketType] = useState(null);
  const [userTicket, setUserTicket] = useState(null);

  async function getUserTicket() {
    try {
      const data = await ticketApi.getTicketByUser(userData.token);
      setUserTicket(data);
      // console.log(data);
      return data;
    } catch (err) {
      console.log(err.message);
    }
  }

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
      setHotelProblemKind('NoError');
      return setHotels(response.data.hotels);
    } catch (error) {
      // console.log(error.message);
      return setHotelProblemKind(error.message);
    }
  }

  async function isRemoteFunc(userTicket) {
    try {
      const response = await api.get('/tickets/types', {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      // console.log(userTicket.ticketTypeId, 'userTicket.ticketTypeId');
      // console.log('response.data', response.data);
      const desiredTicketType = response.data.find((key) => key.id === userTicket.ticketTypeId);
      // console.log('desiredTicketType', desiredTicketType);
      // console.log(desiredTicketType.isRemote, 'desiredTicketType.isRemote');
      if (desiredTicketType.isRemote === true || desiredTicketType.includesHotel === false) {
        return setHotelProblemKind('online');
      }
      return setTicketType(response.data);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getHotels();
        const userTicket = await getUserTicket();
        // console.log('userTicket', userTicket);
        await isRemoteFunc(userTicket);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
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
  /* ${(props) => (props.fullRoom ? 'background-color: #e9e9e9;' : '')} */
  ${(props) => (props.fullRoom ? 'background-color: #e9e9e9;' : props.chosen ? 'background-color: #FFEED2;' : '')}
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

const SubmitContainer = styled.div`
  margin-top: 40px !important;
  width: 100% !important;

  > button {
    margin-top: 0 !important;
  }
`;
