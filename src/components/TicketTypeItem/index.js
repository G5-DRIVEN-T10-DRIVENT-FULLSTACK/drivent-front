/* eslint-disable */
import { Price, Ticket, Type } from './style';

export default function TicketType({ name, price, currentTicket, selectedTicket, setSelectedTicket }) {
  return (
    <Ticket onClick={() => setSelectedTicket(currentTicket)} isSelected={currentTicket.id === selectedTicket?.id}>
      <Type>{name}</Type>
      <Price>R$ {price}</Price>
    </Ticket >
  );
}
