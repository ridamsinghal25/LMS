import { getDBConnectionStatus } from "../database/db.js";

export const checkHealth = async (req, res) => {
  try {
    const dbStatus = getDBConnectionStatus();

    const healthStatus = {
      status: "Ok",
      timeStamp: new Date().toISOString(),
      services: {
        database: {
          status: dbStatus.isConnected ? "healthy" : "unhealthy",
          details: {
            ...dbStatus,
            readyStateText: getReadyStateText(dbStatus.readyState),
          },
        },
        server: {
          status: "healthy",
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        },
      },
    };

    const httpStatus =
      healthStatus.services.database.status === "healthy" ? 200 : 503;

    res.status(httpStatus).json(healthStatus);
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(500).json({
      status: "ERROR",
      timeStamp: new Date().toISOString(),
      error: error.message,
    });
  }
};

// utility method
function getReadyStateText(state) {
  switch (state) {
    case 0:
      return "Disconnected";
    case 1:
      return "Connected";
    case 2:
      return "Connecting";
    case 3:
      return "Disconnecting";
    default:
      return "Unknown";
  }
}
