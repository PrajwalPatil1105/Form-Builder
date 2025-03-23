const express = require("express");
const router = express.Router();
const Form = require("../Model/Form");
const FormResponse = require("../Model/FormResponse");
const connectDB = require("../config/db");

// Fetching all forms data
router.get("/", async (req, res) => {
  try {
    let conn = await connectDB();
    const forms = await Form.find().sort({ updatedAt: -1 });
    res.json(forms);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Errorssss" });
  }
});

// Fetching a specific form by ID
router.get("/:id", async (req, res) => {
  let conn = await connectDB();
  try {
    const form = await Form.findById(req.params.id);

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Creating a new form
router.post("/", async (req, res) => {
  let conn = await connectDB();
  try {
    const { title, inputs } = req.body;
    const formTitle = title || "Untitled Form";
    // Check if a form with the same title already exists (Edge Case)
    const existingForm = await Form.findOne({ title: formTitle });
    if (existingForm) {
      return res.status(400).json({
        message: "Form Already present use another name",
        code: 3,
      });
    }
    const newForm = new Form({
      title: formTitle,
      inputs: inputs || [],
    });
    const savedForm = await newForm.save();
    res.status(201).json(savedForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Updating a form
router.put("/:id", async (req, res) => {
  let conn = await connectDB();
  try {
    const { title, inputs, sections } = req.body;

    const updatedForm = await Form.findByIdAndUpdate(
      req.params.id,
      {
        title,
        inputs,
        updatedAt: Date.now(),
      },
      { new: true }
    );

    if (!updatedForm) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(updatedForm);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Deleting a form
router.delete("/:id", async (req, res) => {
  let conn = await connectDB();
  try {
    const deletedForm = await Form.findByIdAndDelete(req.params.id);

    if (!deletedForm) {
      return res.status(404).json({ message: "Form not found" });
    }
    await FormResponse.deleteMany({ formId: req.params.id });
    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// SUubmitting a form response
router.post("/:id/submit", async (req, res) => {
  let conn = await connectDB();
  try {
    const { formData } = req.body;
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }
    const enhancedResponses = new Map();
    for (const input of form.inputs) {
      const inputId = input._id.toString();
      if (formData[inputId]) {
        enhancedResponses.set(inputId, {
          value: formData[inputId],
          title: input.title,
        });
      }
    }
    const newResponse = new FormResponse({
      formId: req.params.id,
      responses: enhancedResponses,
    });
    await newResponse.save();
    res.status(201).json({ message: "Form submitted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Fetching all responses for a form
router.get("/:id/responses", async (req, res) => {
  let conn = await connectDB();
  try {
    const responses = await FormResponse.find({ formId: req.params.id }).sort({
      submittedAt: -1,
    });
    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
