import express, { Express } from "express";
import cors from "cors";
import { json } from "body-parser";

export const setupMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(json());
  app.use(cors());
};
