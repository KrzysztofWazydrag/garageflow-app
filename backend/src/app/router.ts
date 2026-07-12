import express from "express";

export interface RoutingDependencies {
  // ROUTES_INTERFACE
}

export const createRouter = (_dependencies: RoutingDependencies) => {
  const router = express.Router();

  // ROUTES_CONFIG
  return router;
};
