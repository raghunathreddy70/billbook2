const express = require("express");
const router = express.Router();
const BankDetails = require("../models/BankDetails");
const VenTransactionModel = require("../models/venTransaction");
const Transactions = require("../models/Transactionmodel");

router.post("/bank-details", async (req, res) => {
  try {
    const formData = req.body;

    const randomNum = generateRandomNumber();
    const bankID = `EasyBBBIID${randomNum}`;
    formData.bankId = bankID;

    const bankDetails = new BankDetails(formData);
    const savedBankDetails = await bankDetails.save();

    res.status(201).json(savedBankDetails);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

function generateRandomNumber() {
  return Math.floor(1000000000 + Math.random() * 9000000000);
}

router.get("/bank-details/:bid", async (req, res) => {
  const bussinessid = req.params.bid;
  try {
    const bankDetails = await BankDetails.find({businessId: bussinessid});

    res.status(200).json(bankDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to retrieve bank details" });
  }
});

router.get("/bankdetails/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const bankDetail = await BankDetails.findOne({ bankId: id });
    if (!bankDetail) {
      return res.status(404).json({ error: "Bank detail not found" });
    }
    res.status(200).json(bankDetail);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/bankdetailsedit/:id", async (req, res) => {
  try {
    const bankid = req.params.id;
    const updatedData = req.body;

    const bankDetails = await BankDetails.findOneAndUpdate(
      { bankId: bankid },
      updatedData,
      { new: true }
    );

    if (!bankDetails) {
      return res.status(404).json({ error: "Bank record not found" });
    }

    res.status(200).json(bankDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update Bank record" });
  }
});

router.delete("/deleteBank/:id", async (req, res) => {
  try {
    const bankID = req.params.id;

    const deletedbank = await BankDetails.findOneAndDelete({ bankId: bankID });

    if (!deletedbank) {
      return res.status(404).json({ error: "bank record not found" });
    }
    res.status(200).json({ message: "bank record deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "error bank to delete record" });
  }
});

router.get("/transactions/:id", async (req, res) => {
  const bankid = req.params.id;

  console.log("bankid", bankid);

  try {
    const ventransactions = await VenTransactionModel.find({ bankID: bankid });

    console.log("ventransactions", ventransactions);

    if (!ventransactions) {
      return res.status(404).json({ error: "transactions not found" });
    }

    res.status(200).json(ventransactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/custransactions/:id", async (req, res) => {
  const bankid = req.params.id;

  console.log("bankid", bankid);

  try {
    const transactions = await Transactions.find({ bankID: bankid });

    console.log("banktransactions", transactions);

    if (!transactions) {
      return res.status(404).json({ error: "custransactions not found" });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
