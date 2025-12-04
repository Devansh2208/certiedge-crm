import { Lead } from "../models/Lead.js";

// CREATE lead
export const createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET all leads
export const getLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single lead
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update trainer assignment (NO STATUS CHANGE)
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
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update quote info (NO STATUS CHANGE)
export const updateQuote = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        quoteAmount: req.body.quoteAmount,
        quoteNotes: req.body.quoteNotes,
        quoteSent: true,
        notificationsEnabled: false, // you may want to remove this too
      },
      { new: true }
    );
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Add a new remark
export const addRemark = async (req, res) => {
  try {
    const { text, author } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          remarks: {
            text,
            author,
            timestamp: new Date()
          }
        }
      },
      { new: true }
    );

    res.json(updatedLead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update status (only user controls this)
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
    res.json(lead);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
