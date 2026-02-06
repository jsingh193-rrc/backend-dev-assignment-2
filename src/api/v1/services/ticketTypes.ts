export type TicketPriority = "low" | "medium" | "high" | "critical";

export type TicketStatus = "open" | "in-progress" | "resolved";

export interface Ticket {
  id: string;
  title: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
}

export interface TicketUrgencyResult {
  ticketAge: number;
  urgencyScore: number;
  urgencyLevel: string;
}
