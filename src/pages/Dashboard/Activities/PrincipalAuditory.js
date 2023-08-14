/* eslint-disable space-before-function-paren */
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styled from 'styled-components';
import { RiLoginBoxLine, RiCloseCircleLine } from 'react-icons/ri';

export default function PrincipalAuditory({ item, getCap }) {
  const [duration, setDuration] = useState();
  const [cap, setCap] = useState();

  function getDuration(start, end) {
    const formatedStart = dayjs(start).format('HH:mm');
    const formatedEnd = dayjs(end).format('HH:mm');

    const startTimeObj = dayjs(`2023-08-14T${formatedStart}:00.000Z`);
    const endTimeObj = dayjs(`2023-08-14T${formatedEnd}:00.000Z`);

    return endTimeObj.diff(startTimeObj, 'hour');
  }

  useEffect(async () => {
    const itemDuration = getDuration(item.startTime, item.endTime);
    setDuration(itemDuration);
    const returnedCap = await getCap(item.id);
    setCap(returnedCap);
  }, []);

  console.log('cap: ', cap);

  return (
    <Activity key={item.id} duration={duration}>
      {' '}
      <ActivityInfo>
        <h3>{item.name}</h3>
        <p>
          {dayjs(item.startTime).format('HH:mm')} - {dayjs(item.endTime).format('HH:mm')}
        </p>
      </ActivityInfo>
      <ActivitySvg color={cap < item.capacity ? '#078632' : 'red'}>
        {cap < item.capacity ? (
          <>
            <RiLoginBoxLine />
            <p>{item.capacity} vagas</p>
          </>
        ) : (
          <>
            <RiCloseCircleLine />
            <p>Esgotado</p>
          </>
        )}
      </ActivitySvg>
    </Activity>
  );
}

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
  color: ${(props) => props.color};
  svg {
    font-size: 20px;
  }
  :hover {
    cursor: pointer;
  }
`;
