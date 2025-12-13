import express from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateTrainer,
  updateQuote,
  updateStatus,
  addRemark,
  updateTentativeDate
} from "../controllers/leadController.js";

import { sendNotification } from "../utils/notificationService.js";

const router = express.Router();


// TEST EMAIL ROUTE 

router.get("/test-email", async (req, res) => {
  try {
    await sendNotification({
      recipients: [
        process.env.LOKESH_CONTACT,
        process.env.ANKUSH_CONTACT,
        process.env.ABIR_CONTACT,
      ],
      message: " This is a test email from your CRM backend!"
    });

    res.json({ success: true, message: "Test email sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE lead
router.post("/", createLead);

// GET all leads
router.get("/", getLeads);

// GET single lead
router.get("/:id", getLeadById);

// Update trainer
router.put("/:id/trainer", updateTrainer);

// Update quote
router.put("/:id/quote", updateQuote);

// Update tentative date
router.put("/:id/tentative-date", updateTentativeDate);

// Add remark
router.put("/:id/remarks", addRemark);

// Update status
router.put("/:id/status", updateStatus);

export default router;
