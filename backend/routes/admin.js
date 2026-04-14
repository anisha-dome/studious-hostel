const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");

// GET all inquiries
router.get("/inquiries", async (req, res) => {

try {

const inquiries = await Inquiry.find().sort({ createdAt: -1 });

res.json(inquiries);

} catch (error) {

console.error(error);
res.status(500).json({ message: "Server error" });

}

});

// DELETE inquiry
router.delete("/inquiries/:id", async (req, res) => {

try {

await Inquiry.findByIdAndDelete(req.params.id);

res.json({ message: "Inquiry deleted" });

} catch (error) {

console.error(error);
res.status(500).json({ message: "Server error" });

}

});


router.put("/inquiries/:id", async (req, res) => {

try {

const updated = await Inquiry.findByIdAndUpdate(
req.params.id,
{ status: "Contacted" },
{ new: true }
);

res.json(updated);

} catch (error) {

console.error(error);
res.status(500).json({ message: "Error updating status" });

}

});
module.exports = router;