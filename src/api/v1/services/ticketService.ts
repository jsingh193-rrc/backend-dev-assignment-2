import { Ticket } from "./ticketTypes";
import items from "../../../data/items.json";

export const getAllTickets = async (): Promise<Ticket[]> => {
  return items as Ticket[];
};
