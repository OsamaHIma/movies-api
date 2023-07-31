const express = require("express");
const router = express.Router();
const controller = require("../controllers/watchListControllers");
const auth = require("../middlewares/auth");


router.post("/", auth.check, controller.add);
router.get("/", auth.check, controller.list);
router.delete("/:movie", auth.check, controller.delete);

module.exports = router;
