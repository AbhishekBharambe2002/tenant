import express from "express";
import { upgradeTenant } from "../controllers/tenantController";
import { requireAuth } from "../middleware/auth";

const router = express.Router();

router.post("/tenants/:slug/upgrade", requireAuth, upgradeTenant);

export default router;
