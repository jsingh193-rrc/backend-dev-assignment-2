import { Ticket, TicketPriority, TicketUrgencyResult } from "./ticketTypes";
import items from "../../../data/items.json";

export const getAllTickets = async (): Promise<Ticket[]> => {
    return items as Ticket[];
};

export const getTicketUrgency = async (
    ticketId: string
): Promise<{ ticket: Ticket; metrics: TicketUrgencyResult } | null> => {
    const idNum = Number(ticketId);
    const tickets = items as Ticket[];
    const ticket = tickets.find((t) => {
        if (!isNaN(idNum)) return Number(t.id) === idNum;
        return String(t.id) === ticketId;
    });

    if (!ticket) return null;

    const createdAt = new Date(ticket.createdAt);
    const now = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const ticketAge = Math.max(
        0,
        Math.floor((now.getTime() - createdAt.getTime()) / msPerDay)
    );

    const baseScore: Record<TicketPriority, number> = {
        low: 10,
        medium: 20,
        high: 30,
        critical: 50,
    };

    const urgencyScore = ticketAge * 5 + baseScore[ticket.priority]; // Credit to: Carlos Eusebio Ayale(ceusebioayala@rrc.ca)
    // I tried a lot but couldn't figure out what the formula is. My classmate Carlos helped me to figure it out.

    const urgencyLevel =
        urgencyScore <= 25 ? "Low urgency. Address when capacity allows."
        : urgencyScore <= 35 ? "Moderate. Schedule for attention."
        : urgencyScore <= 45 ? "High urgency. Prioritize resolution."
        : "Critical. Immediate attention required.";

    return {
        ticket,
        metrics: {
            ticketAge,
            urgencyScore,
            urgencyLevel,
        },
    };
};
