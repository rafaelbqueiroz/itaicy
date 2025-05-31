import { Express } from "express";
import http from "http";

export async function registerRoutes(app: Express): Promise<http.Server> {
  const server = http.createServer(app);

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Authentication Routes
  app.post("/api/auth/login", (req, res) => {
    // TODO: Implement login
    res.json({ message: "Login route" });
  });

  app.post("/api/auth/logout", (req, res) => {
    // TODO: Implement logout
    res.json({ message: "Logout route" });
  });

  // Booking Routes
  app.get("/api/booking/availability", (req, res) => {
    // TODO: Implement availability check
    res.json({ message: "Availability check route" });
  });

  app.post("/api/booking/reserve", (req, res) => {
    // TODO: Implement reservation
    res.json({ message: "Reservation route" });
  });

  // Content Routes
  app.get("/api/content/experiences", (req, res) => {
    res.json({
      items: [
        {
          id: "safari",
          title: "Safari Fotográfico",
          description: "Explore a vida selvagem do Pantanal",
          image: "/images/experiences/safari.jpg"
        },
        {
          id: "fishing",
          title: "Pesca Esportiva",
          description: "Pesque em um dos melhores pontos do Pantanal",
          image: "/images/experiences/fishing.jpg"
        }
      ]
    });
  });

  app.get("/api/content/accommodations", (req, res) => {
    res.json({
      items: [
        {
          id: "suite-master",
          title: "Suíte Master",
          description: "Vista panorâmica para o rio",
          image: "/images/accommodations/master.jpg"
        },
        {
          id: "suite-standard",
          title: "Suíte Standard",
          description: "Conforto em meio à natureza",
          image: "/images/accommodations/standard.jpg"
        }
      ]
    });
  });

  // Error handling for API routes
  app.use("/api/*", (req, res) => {
    res.status(404).json({ 
      error: "Not Found",
      message: "The requested API endpoint does not exist"
    });
  });

  return server;
}
