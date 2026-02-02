import express, { Express } from "express";
import healthRoutes from "./api/v1/routes/healthRoutes";
import ticketRoutes from "./api/v1/routes/ticketRoutes";

// Initialize Express application
const app: Express = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Define a route
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// v1 routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/tickets", ticketRoutes);

export default app;