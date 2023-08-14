/* eslint-disable space-before-function-paren */
import { useEffect, useState } from 'react';

import { RiLoginBoxLine, RiCloseCircleLine } from 'react-icons/ri';
import { StyledTypography, StyledParagraph, DayBox } from './style';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';

import * as ticketApi from '../../../services/ticketApi';
import * as eventApi from '../../../services/eventApi';
import * as activityApi from '../../../services/activityApi';

import styled from 'styled-components';
import useToken from '../../../hooks/useToken';
import { toast } from 'react-toastify';
import PrincipalAuditory from './PrincipalAuditory';

export default function Activities() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isRemote, setIsRemote] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activitiesList, setActivitiesList] = useState([]);
  const token = useToken();

  const DayBoxItem = ({ date, isSelected, onSelect }) => {
    return (
      <DayBox selected={isSelected} onClick={onSelect}>
        {date}
      </DayBox>
    );
  };

  function DateRangeList() {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    const dates = [];
    let currentDate = start;

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
      currentDate = currentDate.add(1, 'day');
      const formattedDate = currentDate.locale('pt-br').format('dddd, DD/MM').replace('-feira', '');
      dates.push({ formattedDate, originalDate: currentDate.toISOString() });
    }

    return dates;
  }

  const handleSelect = (date) => {
    setSelectedDate(date.formattedDate);
    getActivity(date.originalDate, token);
  };

  function ProblemMessage() {
    if (isRemote) {
      return (
        <ProblemText>
          Sua modalidade de ingresso não necessita escolher atividade. Você terá acesso a todas as atividades.
        </ProblemText>
      );
    }
    if (!isPaid) {
      return <ProblemText>Você precisa ter confirmado pagamento antes de fazer a escolha de atividades</ProblemText>;
    }
  }

  async function getUserTicket() {
    try {
      const data = await ticketApi.getTicketByUser(token);
      return data;
    } catch (err) {
      toast(err.message);
    }
  }

  async function getEvent() {
    try {
      const data = await eventApi.getEventInfo();
      return data;
    } catch (err) {
      toast(err.message);
    }
  }

  async function getActivity(date) {
    try {
      const data = await activityApi.getDailyActivity(date, token);
      setActivitiesList(data.activityByDayList);
      return data;
    } catch (err) {
      toast(err.message);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const event = await getEvent();
        const userTicket = await getUserTicket();
        setIsPaid(userTicket.status === 'PAID');
        setIsRemote(userTicket.TicketType.isRemote);
        setStartDate(event.startsAt);
        setEndDate(event.endsAt);
      } catch (error) {
        console.error('Error:', error);
      }
    };
    fetchData();
  }, []);

  async function getCap(id) {
    try {
      const data = await activityApi.getCurrentCap(id, token);
      return data.activityEnrollments;
    } catch (err) {
      toast(err.message);
    }
  }

  function renderActivity() {
    if (activitiesList.length !== 0) {
      return (
        <TasksArea>
          <Place>
            <h2>Auditório Principal</h2>
            <TasksWrapper>
              {activitiesList.map(
                (item) => item.activityPlaceId === 1 && <PrincipalAuditory item={item} getCap={getCap} key={item.id} />
              )}
            </TasksWrapper>
          </Place>

          <Place>
            <h2>Auditório Lateral</h2>
            <TasksWrapper>
              {activitiesList.map(
                (item) => item.activityPlaceId === 2 && <PrincipalAuditory item={item} getCap={getCap} key={item.id} />
              )}
            </TasksWrapper>
          </Place>

          <Place>
            <h2>Sala de Workshop</h2>
            <TasksWrapper>
              {activitiesList.map(
                (item) => item.activityPlaceId === 3 && <PrincipalAuditory item={item} getCap={getCap} key={item.id} />
              )}
            </TasksWrapper>
          </Place>
        </TasksArea>
      );
    }
  }

  useEffect(() => {
    renderActivity();
  }, [activitiesList]);

  const dates = DateRangeList();

  return (
    <>
      <StyledTypography variant="h4">Escolha de atividades</StyledTypography>
      <Container>
        {!isPaid || isRemote ? (
          <ProblemWrapper>
            <ProblemMessage />
          </ProblemWrapper>
        ) : (
          <>
            <StyledParagraph>Primeiro, filtre pelo dia do evento: </StyledParagraph>
            <Wrapper>
              {dates.map((date, index) => (
                <DayBoxItem
                  key={index}
                  date={date.formattedDate}
                  isSelected={selectedDate === date.formattedDate}
                  onSelect={() => handleSelect(date)}
                />
              ))}
            </Wrapper>
            {renderActivity()}
            {/* <TasksArea>
              <Place>
                <h2>Auditório Principal</h2>
                <TasksWrapper>
                  <Activity>
                    <ActivityInfo>
                      <h3>Minecraft: montando o PC ideal</h3>
                      <p>09:00 - 10:00</p>
                    </ActivityInfo>

                    <ActivitySvg>
                      <RiLoginBoxLine />
                      <p>27 vagas</p>
                    </ActivitySvg>
                  </Activity>
                  <Activity>
                    <ActivityInfo>
                      <h3>Minecraft: montando o PC ideal</h3>
                      <p>09:00 - 10:00</p>
                    </ActivityInfo>

                    <ActivitySvg>
                      <RiLoginBoxLine />
                      <p>27 vagas</p>
                    </ActivitySvg>
                  </Activity>
                </TasksWrapper>
              </Place>

              <Place>
                <h2>Auditório Lateral</h2>
                <TasksWrapper>
                  <Activity>
                    <ActivityInfo>
                      <h3>Minecraft: montando o PC ideal</h3>
                      <p>09:00 - 10:00</p>
                    </ActivityInfo>

                    <ActivitySvg>
                      <RiLoginBoxLine />
                      <p>27 vagas</p>
                    </ActivitySvg>
                  </Activity>
                  <Activity>
                    <ActivityInfo>
                      <h3>Minecraft: montando o PC ideal</h3>
                      <p>09:00 - 10:00</p>
                    </ActivityInfo>

                    <ActivitySvg>
                      <RiCloseCircleLine />
                      <p>Esgotado</p>
                    </ActivitySvg>
                  </Activity>
                </TasksWrapper>
              </Place>

              <Place>
                <h2>Sala de Workshop</h2>
                <TasksWrapper>
                  <Activity>
                    <ActivityInfo>
                      <h3>Minecraft: montando o PC ideal</h3>
                      <p>09:00 - 10:00</p>
                    </ActivityInfo>

                    <ActivitySvg>
                      <RiLoginBoxLine />
                      <p>27 vagas</p>
                    </ActivitySvg>
                  </Activity>
                  <Activity>
                    <ActivityInfo>
                      <h3>Minecraft: montando o PC ideal</h3>
                      <p>09:00 - 10:00</p>
                    </ActivityInfo>

                    <ActivitySvg>
                      <RiLoginBoxLine />
                      <p>27 vagas</p>
                    </ActivitySvg>
                  </Activity>
                </TasksWrapper>
              </Place>
            </TasksArea> */}
          </>
        )}
      </Container>
    </>
  );
}

const Container = styled.div`
  font-family: 'Roboto', sans-serif;

  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 60px;
  margin-top: 15px;
`;

const ProblemWrapper = styled.div`
  width: 100%;
  height: 570px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 20px;
`;

const TasksArea = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const TasksWrapper = styled.div`
  width: 100%;
  height: 390px;
  padding: 8px;
  border: 1px solid #d7d7d7;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const Place = styled.div`
  width: 33.3%;
  display: flex;
  flex-direction: column;
  gap: 10px;

  h2 {
    color: #7b7b7b;
    font-size: 20px;
    text-align: center;
  }
`;

const Activity = styled.div`
  width: 100%;
  height: ${(props) => `calc(80px * ${props.duration})`};
  background: #f1f1f1;
  border-radius: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  color: #343434;
  font-size: 12px;
`;

const ActivityInfo = styled.div`
  width: 75%;
  height: 80%;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
  h3 {
    font-weight: 700;
  }
`;

const ActivitySvg = styled.div`
  display: flex;
  width: 25%;
  height: 70%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #cfcfcf;
  font-size: 10px;
  color: #078632;
  svg {
    font-size: 20px;
  }
  :hover {
    cursor: pointer;
  }
`;

const ProblemText = styled.p`
  color: #8e8e8e;
  width: 550px;
  word-break: break-word;
  text-align: center;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
