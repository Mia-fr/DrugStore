const { error } = require("console");
const express = require("express");
const mongoose = require("mongoose");

// crea de mon serveur
const app = express();

// receptionner des body
app.use(express.json());

mongoose.connect("mongodb://localhost/drugstore");

//
//

const Drug = mongoose.model("Drug", {
  name: String,
  quantity: Number,
});

app.post("/create", async (req, res) => {
  try {
    const drugExists = await Drug.findOne({
      name: req.body.name,
    });

    if (drugExists) {
      res.status(400).json({ error: { message: "Drug already exists" } });
    } else {
      const newDrug = new Drug({
        name: req.body.name,
        quantity: req.body.quantity,
      });
      await newDrug.save();
      res.json(newDrug);
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//

app.get("/", async (req, res) => {
  try {
    const drugs = await Drug.find();
    res.json(drugs);
  } catch {
    res.status(400).json({ error: error.message });
  }
});

//

app.post("/drugs/add", async (req, res) => {
  try {
    // console.log(req.body);

    const drugUpdate = await Drug.findById(req.body.id);

    if (drugUpdate) {
      drugUpdate.quantity += req.body.quantity;
      await drugUpdate.save();
      res.json(drugUpdate);
    } else {
      res.status(400).json({ message: "Bad request" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

//
//
app.listen(3000, () => {
  console.log("Serveur en marche");
});
