import { Request, Response } from "express";
import { TenantModel } from "../models/Tenant";
import { RequestWithUser } from "../middleware/auth";
import { requireRole } from "../middleware/requireRole";

// POST /tenants/:slug/upgrade
export async function upgradeTenant(req: RequestWithUser, res: Response): Promise<void> {
    const { slug } = req.params;
    if (!req.user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
    }
    // Only Admin can upgrade; ensure same tenant
    if (req.user.role !== "Admin") {
        res.status(403).json({ error: "Only Admins can upgrade" });
        return;
    }

    // Find tenant by slug
    const tenant = await TenantModel.findOne({ slug }).exec();
    if (!tenant) {
        res.status(404).json({ error: "Tenant not found" });
        return;
    }

    // ensure admin is part of same tenant
    if (tenant._id.toString() !== req.user.tenantId) {
        res.status(403).json({ error: "Cannot upgrade other tenant" });
        return;
    }

    tenant.plan = "pro";
    await tenant.save();
    res.json({ success: true, tenant: { slug: tenant.slug, plan: tenant.plan } });
}
