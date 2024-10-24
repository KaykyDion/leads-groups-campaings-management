import { Router } from "express";
import { HttpError } from "./errors/HttpError";

const router = Router();

router.get("/status", (req, res, next) => {
  try {
    res.json({ message: "OK" });
  } catch (error) {
    next(error);
  }
});

export { router };
