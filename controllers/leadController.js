import { Lead } from "../models/Lead.js";
import { notifyOnChange } from "../utils/changeNotifier.js";

/* ============================
   CREATE LEAD
   ============================ */
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   GET ALL LEADS
   ============================ */
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   GET SINGLE LEAD
   ============================ */
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   UPDATE TRAINER
   ============================ */
export const updateTrainer = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        trainerFound: req.body.trainerFound,
        trainerName: req.body.trainerName,
      },
      { new: true }
    );

    await notifyOnChange({
      lead,
      message: `👨‍🏫 Trainer updated for course "${lead.course}". Trainer: ${lead.trainerName}`,
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   UPDATE QUOTE
   ============================ */
export const updateQuote = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        quoteAmount: req.body.quoteAmount,
        quoteNotes: req.body.quoteNotes,
        quoteSent: true,
      },
      { new: true }
    );

    await notifyOnChange({
      lead,
      message: `💰 Quote updated for "${lead.course}". Amount: ₹${lead.quoteAmount}`,
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   ADD REMARK
   ============================ */
export const addRemark = async (req, res) => {
  try {
    const { text, author } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          remarks: {
            text,
            author,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    await notifyOnChange({
      lead,
      message: `📝 New remark added by ${author} for "${lead.course}": "${text}"`,
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   UPDATE TENTATIVE DATE
   ============================ */
export const updateTentativeDate = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { tentativeDate: req.body.tentativeDate },
      { new: true }
    );

    await notifyOnChange({
      lead,
      message: `📅 Tentative date updated for "${lead.course}": ${new Date(
        lead.tentativeDate
      ).toDateString()}`,
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ============================
   UPDATE STATUS
   ============================ */
export const updateStatus = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
        notificationsEnabled: req.body.notificationsEnabled,
      },
      { new: true }
    );

    await notifyOnChange({
      lead,
      message: `📌 Status updated to "${lead.status}" for course "${lead.course}".`,
    });

    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
