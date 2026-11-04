require("dotenv").config();
console.log("ENV file path:", require("path").resolve(".env"));
console.log("MONGO_URI loaded:", Boolean(process.env.MONGO_URI));
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmergencyContact = require("./models/EmergencyContact");
const MedicalInfo = require("./models/MedicalInfo");
const EmergencyHistory = require("./models/EmergencyHistory");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("MongoDB connection failed:", error.message);
  });

  app.post("/api/contacts", async (req, res) => {
    try {
        const contact = new EmergencyContact(req.body);
        await contact.save();

        res.status(201).json({
            message: "Emergency contact saved successfully",
            contact: contact
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to save emergency contact",
            error: error.message
        });
    }
});

app.get("/api/contacts", async (req, res) => {
    

app.delete("/api/emergency-history/:id", async (req, res) => {
  try {
    console.log("DELETE route reached. ID:", req.params.id);

    const history = await EmergencyHistory.findByIdAndDelete(
      req.params.id
    );

    if (!history) {
      return res.status(404).json({
        message: "Record not found in MongoDB"
      });
    }

    return res.status(200).json({
      message: "Emergency history deleted successfully"
    });
  } catch (error) {
    console.error("DELETE route error:", error);

    return res.status(500).json({
      message: "Failed to delete emergency history",
      error: error.message
    });
  }
});


    try {
        const contacts = await EmergencyContact.find();

        res.json(contacts);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch contacts",
            error: error.message
        });
    }
});



app.post("/api/medical-info", async (req, res) => {
    try {
        let medicalInfo = await MedicalInfo.findOne();

        if (medicalInfo) {
            Object.assign(medicalInfo, req.body);
        } else {
            medicalInfo = new MedicalInfo(req.body);
        }

        await medicalInfo.save();

        res.status(200).json({
            message: "Medical information saved successfully",
            medicalInfo
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to save medical information",
            error: error.message
        });
    }
});

app.get("/api/medical-info", async (req, res) => {
    try {
        const medicalInfo = await MedicalInfo.findOne();

        res.json(medicalInfo || {});
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch medical information",
            error: error.message
        });
    }
});


app.get("/", (req, res) => {
    res.send("Digital Emergency Companion Backend is Running!");
});

const PORT = 5000;


app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found"
      });
    }

    res.status(200).json({
      message: "Contact deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact",
      error: error.message
    });
  }
});

// Delete an emergency contact
app.delete("/api/contacts/:id", async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndDelete(
      req.params.id
    );

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found in MongoDB"
      });
    }

    return res.status(200).json({
      message: "Contact deleted successfully"
    });

  } catch (error) {
    console.error("Delete contact error:", error);

    return res.status(500).json({
      message: "Failed to delete contact",
      error: error.message
    });
  }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});



// Add emergency history
app.post("/api/emergency-history", async (req, res) => {
  try {
    const history = new EmergencyHistory(req.body);
    await history.save();

    res.status(201).json({
      message: "Emergency history saved successfully",
      history: history
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to save emergency history",
      error: error.message
    });
  }
});

// Get emergency history
app.get("/api/emergency-history", async (req, res) => {
  try {
    const history = await EmergencyHistory.find().sort({ date: -1 });

    res.json(history);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch emergency history",
      error: error.message
    });
  }
});








// mongoose.connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB connected successfully");
//   })
//   .catch((error) => {
//     console.error("MongoDB connection failed:");
//     console.error(error);
//   });