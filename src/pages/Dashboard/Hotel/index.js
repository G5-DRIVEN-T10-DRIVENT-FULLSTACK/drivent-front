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

function selectRoomFunction(hotelId, roomId, setRoomIdToBack, capacity) {
  console.log('hotelId', hotelId);
  console.log('roomId', roomId);
  console.log('capacity', capacity);
  const sendableRoomId = roomId;
  setRoomIdToBack({ roomId: sendableRoomId, hotelId: hotelId });
  setRoomIdToBack({ roomId: sendableRoomId });
}

export function RoomsHeadingTitle({
  showRooms,
  hotelClickedStates,
  vacancies,
  rooms,
  roomIdToBack,
  setRoomIdToBack,
  changeRoom,
}) {
  // console.log('hotelClickedStates', hotelClickedStates);
  // console.log(Object.keys(hotelClickedStates).find((hotelId) => hotelClickedStates[hotelId] === true));
  // console.log('showRooms', showRooms);
  const { userData } = useContext(UserContext);
  console.log(userData);
  // const [roomIdToBack, setRoomIdToBack] = useState({});

  if (showRooms) {
    console.log('hotelClickedStates', hotelClickedStates);
    const hotelId = Object.keys(hotelClickedStates).find((hotelId) => hotelClickedStates[hotelId] === true);
    // console.log('hotelId', hotelId);
    let hotelRoomsInfo = [];
    console.log('vacancies', vacancies);
    console.log('vacancies.capacity', vacancies.capacity);
    const hotelsIdArrays = vacancies.hotelIdArray;
    // console.log('hotelsIdArrays', hotelsIdArrays);
    // console.log('hotelId', hotelId);
    const roomsKeys = Object.keys(hotelsIdArrays).filter((key) => Number(hotelsIdArrays[key]) === Number(hotelId));
    console.log('roomsKeys', roomsKeys);
    hotelRoomsInfo = roomsKeys.map((ta, index) => {
      // console.log(roomIdToBack === ta);
      // console.log('roomIdToBack', roomIdToBack);
      // console.log('ta', ta);
      // console.log('accommodations'), rooms;
      return {
        id: rooms[ta].id,
        totalCapacity: vacancies.capacity[ta],
        availableCapacity: vacancies.hotelVacanciesArray[ta],
        choisen: roomIdToBack.roomId === rooms[ta].id ? true : false,
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
                  if (i === hri.totalCapacity - 1 && hri.choisen) {
                    personIcons.push(<BsPersonFill key={i} size={30} color={'#FF4791'} />);
                  } else {
                    personIcons.push(<BsPerson key={i} size={30} />);
                  }
                } else {
                  if (hri.availableCapacity - i) {
                    if (hri.choisen && hri.availableCapacity - i === 1) {
                      personIcons.push(<BsPersonFill key={i} size={30} color={'#FF4791'} />);
                    } else if (hri.availableCapacity - i < 0) {
                      personIcons.push(
                        <BsPersonFill key={i} size={30} color={!hri.availableCapacity ? '#8C8C8C' : '#000000'} />
                      );
                    } else {
                      personIcons.push(<BsPerson key={i} size={30} />);
                    }
                  } else {
                    personIcons.push(
                      <BsPersonFill key={i} size={30} color={!hri.availableCapacity ? '#8C8C8C' : '#000000'} />
                    );
                  }
                }
              }
              return (
                <RoomContainer
                  onClick={() => selectRoomFunction(hotelId, hri.id, setRoomIdToBack, hri.availableCapacity)}
                  key={index}
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
            <Button onClick={async () => await choiceRoomFunction(roomIdToBack, userData, changeRoom)}>
              RESERVAR QUARTO
            </Button>
          </SubmitContainer>
        </RoomChoice>
      </>
    );
  } else {
    return <></>;
  }
}

async function choiceRoomFunction(roomIdToBack, userData, changeRoom) {
  const body = { roomId: Number(roomIdToBack.roomId) };
  //mando no body o novo

  try {
    if (changeRoom) {
      const response = await api.put(`/booking/${Number(roomIdToBack.roomId)}`, body,  {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      return window.location.reload();
    }
    const response = await api.post('/booking', body, {
      headers: {
        Authorization: `Bearer ${userData.token}`,
      },
    });
    console.log('response, booking', response);
    window.location.reload();
  } catch (e) {
    return console.log(e.message);
  }
}

function changeRoomFunc(setChangeRoom) {
  setChangeRoom(true);
}

function HotelOrderInfo({ isBooking, changeRoom, setChangeRoom }) {
  // console.log('roomIdToBack', roomIdToBack);
  console.log('!!changeRoom', !!changeRoom);
  // console.log('isBooking ', isBooking);
  // console.log('isBooking !== false', isBooking !== false);
  if (!!isBooking && !changeRoom) {
    console.log('isBooking', isBooking);
    return (
      <>
        <HotelOrderInfoContainer>
          <RoomsHeadingTitleStyle>Você já escolheu seu quarto:</RoomsHeadingTitleStyle>
          <HotelInfoContainer clicked={true}>
            <HotelImage src={isBooking.Room.hotelImage} />
            <HotelName>{isBooking.Room.hotelName}</HotelName>
            <HotelSubtitle>Quarto reservado:</HotelSubtitle>
            <HotelInfo>
              {isBooking.Room.id} ({isBooking.Room.stringCapacity})
            </HotelInfo>
            <HotelSubtitle>Pessoas no seu quarto</HotelSubtitle>
            <HotelInfo>{isBooking.Room.availableCap}</HotelInfo>
          </HotelInfoContainer>
          <SubmitContainer>
            <Button onClick={() => changeRoomFunc(setChangeRoom)}>TROCAR DE QUARTO</Button>
          </SubmitContainer>
        </HotelOrderInfoContainer>
      </>
    );
  } else return <></>;
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
function HotelChoice({ hotelProblem, hotels, vacancies, rooms, isBooking, roomIdToBack, setRoomIdToBack, changeRoom }) {
  const [hotelClickedStates, setHotelClickedStates] = useState({});
  const [showRooms, setShowRooms] = useState(false);
  // const [roomIdToBack, setRoomIdToBack] = useState({});

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
  // console.log('isBooking', isBooking);
  // if (hotelProblem === 'NoError' && hotels.length !== 0) {
  if ((hotelProblem === 'NoError' && hotels.length !== 0 && !isBooking) || changeRoom) {
    console.log('hotels', hotels);
    const allHotelCap = [];
    allHotelCap?.push(Number(hotels[0].vacanciesSum));
    console.log('allHotelCap', allHotelCap);
    let sub = 0;
    for (let i = 1; i < hotels.length; i++) {
      sub += allHotelCap[i - 1];
      allHotelCap.push(Number(hotels[i].vacanciesSum) - sub);
    }
    console.log('allHotelCap', allHotelCap);
    return (
      <>
        <HotelChoiceContainer>Primeiro, escolha seu hotel</HotelChoiceContainer>
        <HotelsContainer>
          <Hotels>
            {hotels.map((h, index) => (
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
                <HotelInfo>{allHotelCap[index]}</HotelInfo>
              </HotelInfoContainer>
            ))}
          </Hotels>
          <RoomsHeadingTitle
            showRooms={showRooms}
            hotelClickedStates={hotelClickedStates}
            vacancies={vacancies}
            rooms={rooms}
            roomIdToBack={roomIdToBack}
            setRoomIdToBack={setRoomIdToBack}
            changeRoom={changeRoom}
          />
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
  const [rooms, setRooms] = useState([]);
  const [vacancies, setVacancies] = useState([]);
  const [ticketType, setTicketType] = useState(null);
  const [userTicket, setUserTicket] = useState(null);
  const [isBooking, setIsBooking] = useState(null);
  const [roomIdToBack, setRoomIdToBack] = useState({});
  const [changeRoom, setChangeRoom] = useState(false);

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
      console.log('response.data', response.data);

      setRooms(response.data.rooms);
      setVacancies(vacanciesObject);

      // console.log('response.data.hotels', response.data.hotels);
      // console.log('response.data.hotels', response.data.hotels);
      // console.log('response.data.accommodation', response.data.accommodation);
      // console.log('response.data.vacancies', response.data.vacancies);
      setHotelProblemKind('NoError');
      setHotels(response.data.hotels);
      return response.data;
    } catch (error) {
      // console.log(error.message);
      return setHotelProblemKind(error.message);
    }
  }

  async function isBookingFunc(superGetData) {
    console.log('isBookingFunc');
    try {
      const response = await api.get('/booking', {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });
      const bookingObject = response.data;
      console.log('bookingObject', bookingObject);
      console.log('superGetData', superGetData);
      const hotelObject = superGetData.hotels.find((h) => h.id === bookingObject.Room.hotelId);
      console.log('hotelObject', hotelObject);
      console.log('superGetData.vacancies.hotelIdArray', superGetData.vacancies.hotelIdArray);
      const roomsKeys = Object.keys(superGetData.vacancies.hotelIdArray).filter(
        (key) => Number(superGetData.vacancies.hotelIdArray[key]) === bookingObject.Room.hotelId
      );
      console.log('roomsKeys', roomsKeys);

      const hotelRoomsInfo = roomsKeys.map((ta) => {
        return {
          id: superGetData.rooms[ta].id,
          totalCapacity: superGetData.vacancies.capacity[ta],
          availableCapacity: superGetData.vacancies.hotelVacanciesArray[ta],
        };
      });
      console.log('hotelRoomsInfo', hotelRoomsInfo);
      console.log('bookingObject.Room.hotelId', bookingObject.Room.id);
      const roomObject = hotelRoomsInfo.find((hr) => hr.id === bookingObject.Room.id);

      console.log('roomObject', roomObject);

      if (roomObject.totalCapacity === 1) {
        bookingObject.Room.availableCap = 'Apenas você no quarto';
        bookingObject.Room.stringCapacity = 'Single';
      } else if (roomObject.totalCapacity === 2 && roomObject.availableCapacity == 0) {
        bookingObject.Room.availableCap = 'Você e mais 1';
        bookingObject.Room.stringCapacity = 'Double';
      } else if (roomObject.totalCapacity === 2 && roomObject.availableCapacity === 1) {
        bookingObject.Room.availableCap = 'Apenas você no quarto';
        bookingObject.Room.stringCapacity = 'Double';
      } else if (roomObject.totalCapacity === 3 && roomObject.availableCapacity === 2) {
        bookingObject.Room.availableCap = 'Apenas você no quarto';
        bookingObject.Room.stringCapacity = 'Triple';
      } else if (roomObject.totalCapacity === 3 && roomObject.availableCapacity == 1) {
        bookingObject.Room.availableCap = 'Você e mais 1';
        bookingObject.Room.stringCapacity = 'Triple';
      } else if (roomObject.totalCapacity === 3 && roomObject.availableCapacity == 0) {
        // console.log('aqui');
        bookingObject.Room.availableCap = 'Você e mais 2';
        bookingObject.Room.stringCapacity = 'Triple';
      }

      bookingObject.Room.hotelName = hotelObject.name;
      bookingObject.Room.hotelImage = hotelObject.image;
      // bookingObject.Room.stringCapacity = hotelObject.accommodation;

      setIsBooking(bookingObject);
      return bookingObject;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      if (error.message.includes('404')) {
        setIsBooking(false);
      }
      console.log("error.message.includes('404')", error.message.includes('404'));
      console.log(error.message);
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
        const response = await getHotels();
        const userTicket = await getUserTicket();
        // console.log('userTicket', userTicket);
        await isRemoteFunc(userTicket);
        // console.log('response', response);
        // const stringCapacity = re
        await isBookingFunc(response);
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
        <HotelChoice
          hotels={hotels}
          hotelProblem={hotelProblemKind}
          vacancies={vacancies}
          rooms={rooms}
          isBooking={isBooking}
          roomIdToBack={roomIdToBack}
          setRoomIdToBack={setRoomIdToBack}
          changeRoom={changeRoom}
          setChangeRoom={setChangeRoom}
        />
        <HotelOrderInfo
          isBooking={isBooking}
          changeRoom={changeRoom}
          setChangeRoom={setChangeRoom}
          setIsBooking={setIsBooking}
          roomIdToBack={roomIdToBack}
        />
      </HotelContent>
    </>
  );
}

const HotelOrderInfoContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

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
