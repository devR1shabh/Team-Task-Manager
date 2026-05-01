const express = require("express");
const {
  createTask,
  getTasks,
  updateTaskStatus
} = require("../controllers/taskController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(requireRole("admin"), createTask).get(getTasks);
router.put("/:id/status", updateTaskStatus);

module.exports = router;
