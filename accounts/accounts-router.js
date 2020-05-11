const express = require("express");

//knex
const db = require("../data/dbConfig.js");

const router = express.Router();

router.get("/", (req, res) => {
  db.select("*")
    .from("accounts")
    .then((accounts) => {
      res.status(200).json({ data: accounts });
    })
    .catch((errror) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.get("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .first()
    .then((account) => {
      if (account) {
        res.status(200).json({ data: account });
      } else {
        res.status(404).json({ message: "No accounts found with that id" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.post("/", (req, res) => {
  const account = req.body;
  if (isValidAccount(account)) {
    db("accounts")
      .insert(account, "id")
      .then((ids) => {
        res.status(201).json({ data: ids, account });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ message: error.message });
      });
  }
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  db("accounts")
    .where({ id: req.params.id })
    .update(changes)
    .then((countOfRecords) => {
      if (countOfRecords > 0) {
        res.status(200).json({ data: countOfRecords });
      } else {
        res.status(404).json({ message: "record not found by that id" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

router.delete("/:id", (req, res) => {
  db("accounts")
    .where({ id: req.params.id })
    .del()
    .then((count) => {
      if (count > 0) {
        res
          .status(200)
          .json({
            message: `the post with the id of ${count} has successfully been deleted`,
          });
      } else {
        res.status(404).json({ message: "record not found by that id" });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: error.message });
    });
});

function isValidAccount(account) {
  return Boolean(account.name && account.budget);
}

module.exports = router;
