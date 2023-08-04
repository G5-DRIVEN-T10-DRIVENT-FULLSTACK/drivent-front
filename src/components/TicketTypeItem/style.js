import styled from 'styled-components';

export const Ticket = styled.li`
  background-color: ${({ isSelected }) => isSelected ? '#FFEED2' : ''};
  width: 145px;
  height: 145px;
  border-radius: 20px;
  border: ${({ isSelected }) => isSelected ? '' : '1px solid #CECECE'};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  cursor: pointer;
`;

export const Type = styled.p`
  color: #454545;
  font-weight: 400;
  font-size: 16px;
  line-height: 18.75px;
`;

export const Price = styled.p`
  color: #898989;
  font-weight: 400;
  font-size: 14px;
  line-height: 16.41px;
`;
