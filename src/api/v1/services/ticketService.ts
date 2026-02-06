import { Ticket, TicketPriority, TicketStatus, TicketUrgencyResult } from "./ticketTypes";
import items from "../../../data/items.json";

const ticketsStore: Ticket[] = (items as Ticket[]).map((t) => ({ ...t }));

export const getAllTickets = async (): Promise<Ticket[]> => {
    return structuredClone(ticketsStore);
};

export const createTicket = async (data: {
    title: string;
    description: string;
    priority: TicketPriority;
    status?: TicketStatus;
}): Promise<Ticket> => {
    const nextId = (() => {
        const ids = ticketsStore.map((t) => Number(t.id)).filter((n) => !isNaN(n));
        const maxId = ids.length ? Math.max(...ids) : 0;
        return String(maxId + 1);
    })();

    const newTicket: Ticket = {
        id: nextId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status ?? "open",
        createdAt: "2026-02-05T00:00:00.000Z",
    };

    ticketsStore.push(newTicket);
    return structuredClone(newTicket);
};

export const updateTicket = async (
    ticketId: string,
    updates: { priority?: TicketPriority; status?: TicketStatus }
): Promise<Ticket | null> => {
    const idNum = Number(ticketId);
    const index = ticketsStore.findIndex((t) => {
        if (!isNaN(idNum)) return Number(t.id) === idNum;
        return String(t.id) === ticketId;
    });

    if (index === -1) return null;

    const existing = ticketsStore[index];
    const updated: Ticket = {
        ...existing,
        priority: updates.priority ?? existing.priority,
        status: updates.status ?? existing.status,
    };

    ticketsStore[index] = updated;
    return structuredClone(updated);
};

export const getTicketUrgency = async (
    ticketId: string
): Promise<{ ticket: Ticket; score: TicketUrgencyResult } | null> => {
    const idNum = Number(ticketId);
    const ticket = ticketsStore.find((t) => {
        if (!isNaN(idNum)) return Number(t.id) === idNum;
        return String(t.id) === ticketId;
    });

    if (!ticket) return null;

    const createdAt = new Date(ticket.createdAt);
    const now = new Date("2026-02-05T00:00:00.000Z");
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
        score: {
            ticketAge,
            urgencyScore,
            urgencyLevel,
        },
    };
};
