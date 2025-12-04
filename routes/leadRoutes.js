import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateTrainer,
  updateQuote,
  updateStatus,
} from "../controllers/leadController.js";

import { sendNotification } from "../utils/notificationService.js";  // <-- IMPORTANT

const router = express.Router();

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.put("/:id/trainer", updateTrainer);
router.put("/:id/quote", updateQuote);
router.put("/:id/status", updateStatus);
import { addRemark } from "../controllers/leadController.js";

router.put("/:id/remarks", addRemark);

// TEST EMAIL ROUTE

router.get("/test-email", async (req, res) => {
  try {
    await sendNotification({
      recipients: [
        process.env.LOKESH_CONTACT,
        process.env.ANKUSH_CONTACT,
      ],
      message: " This is a test email from your CRM backend!",
    });

    res.json({ success: true, message: "Test email sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
