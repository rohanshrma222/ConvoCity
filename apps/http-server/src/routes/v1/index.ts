import { Router } from "express";

export const router: Router = Router();

router.get("/elements", (req, res) => {
    res.json({ message: "v1 API", status: "ok" });
});

 