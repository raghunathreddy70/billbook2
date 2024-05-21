const express = require("express");
const router = express.Router();
const InvoiceTemplates = require("../models/invoiceTemplates");
const BusinessSchema = require("../models/businessModel");

// router.post('/invoiceTemplates', async (req, res) => {
//     try {
//       const { formData } = req.body;
//       console.log("formData", formData);

//       const invoiceTemplate = new InvoiceTemplates(formData);

//       const savedInvoiceTemplate = await invoiceTemplate.save();
//       res.status(201).json(savedInvoiceTemplate);
//     } catch (error) {
//       console.error(error);
//       res.status(400).json({ error: "Failed to create Invoice Template" });
//     }
//   });

router.put("/invoiceTemplates", async (req, res) => {
  const { template, businessId } = req.body;
  console.log("template", template);

  try {

    const updatedTemplate = await BusinessSchema.findOne({_id: businessId});

    updatedTemplate.template = template;

    await updatedTemplate.save();

    console.log("updatedTemplate", updatedTemplate);
    if (!updatedTemplate) {

      const createTemplate =  new InvoiceTemplates({"template": template});
      return res.status(200).json(createTemplate);
    }

    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/invoiceTemplates", async (req, res) => {
  const { template } = req.body;

  try {
    //   const updatedTemplate = await InvoiceTemplates.findByIdAndUpdate(
    //     id,
    //     formData,
    //     { new: true }
    //   );

    const updatedTemplate = await InvoiceTemplates.create({ template });

    if (!updatedTemplate) {
      return res.status(404).json({ error: "Invoice template not found" });
    }

    res.status(200).json(updatedTemplate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/invoiceTemplatesfordetails", async (req, res) => {
  // const { id } = req.params;

  try {
    const invoiceTemplate = await InvoiceTemplates.find();

    res.status(200).json(invoiceTemplate);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
