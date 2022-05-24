const express = require("express");
const router = express.Router();
const path = require("path");
const {findAll} = require("../controller/bookingController");
router
    .route("/")
    .get((req, res) =>
        findAll(req,res)
)

module.exports = router;