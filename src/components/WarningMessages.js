import styled from 'styled-components';

export default function WarningMessage({ warning }) {
  return (
    <Container>
      <p>{warning}</p>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  p{
    font-family: 'Roboto', sans-serif;
    color: #8E8E8E;
    font-weight: 400;
    font-size: 20px;
    line-height: 23.44px;
  }
`;
