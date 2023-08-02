import styled from 'styled-components';
import Typography from '@material-ui/core/Typography';
import { useEffect, useState } from 'react';
import api from '../../../services/api';

function ProblemMessage({ problem }) {
  if (problem === 'NoHotel') {
    return (
      <>
        <ProblemText>
          Sua modalidade de ingresso não inclui hospedagem Prossiga para a escolha de atividades
        </ProblemText>
      </>
    );
  }
  if (problem.includes('status code 402')) {
    return (
      <>
        <ProblemText>Você precisa ter confirmado pagamento antes de fazer a escolha de hospedagem</ProblemText>
      </>
    );
  } else {
    return <></>;
  }
}
// function NotPaid() {
//   return (
//     <>
//       <p>notPaid</p>
//     </>
//   );
// }
// function HotelChoice() {
//   return (
//     <>
//       <p>hotelchoice</p>
//     </>
//   );
// }
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
  const [problemKind, setProblemKind] = useState('');
  /* eslint-disable-next-line */
  const [hotels, setHotels] = useState('');
  /* eslint-disable-next-line */
  const [ticketType, setTicketType] = useState('');
  async function getHotels() {
    try {
      const response = await api.get('/hotels', {
        headers: {
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY5MDk1MTkzN30.1iNeNt7l-K4qAtWJ1VvfGdZMFR2kZeMFjXRe7c0erxs',
        },
      });
      // /* eslint-disable-next-line no-console */
      // console.log(response);
      return setHotels(response);
    } catch (error) {
      // /* eslint-disable-next-line no-console */
      // console.log(error);
      // /* eslint-disable-next-line no-console */
      // console.log(error.message);
      return setProblemKind(error.message);
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
      /* eslint-disable-next-line no-console */
      console.log('isRemoteFunc', response.data[0].isRemote);
      if (response.data[0].isRemote === true) {
        return setProblemKind('NoHotel');
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
        {/* <ProblemMessage problem={'NoHotel'} /> */}
        <ProblemMessage problem={problemKind} />
        {/* <ProblemMessage problem={'NoHotel'} /> */}
      </HotelContent>
      {/* <HotelChoice />
      <RoomChoice />
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
`;

const HotelContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`;
