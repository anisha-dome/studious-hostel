const express = require("express");
const router = express.Router();
const Inquiry = require("../models/Inquiry");

// Save contact form
router.post("/", async (req, res) => {

    try {

        const { name, email, phone, subject, message } = req.body;

        const newInquiry = new Inquiry({
            name,
            email,
            phone,
            subject,
            message
        });

        await newInquiry.save();

        res.json({ message: "Inquiry saved successfully" });

    } catch (error) {

        console.error(error);
        res.status(500).json({ message: "Server error" });

    }

});

module.exports = router;