import { Router } from "express";

const router = Router();

router.post("/auth/logout", (_req, res) => {
	res.sendStatus(204);
});