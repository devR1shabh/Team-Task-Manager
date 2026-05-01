const express = require("express");
const {
  createProject,
  getProjects,
  updateProjectMembers
} = require("../controllers/projectController");
const { protect } = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.use(protect);

router.route("/").post(requireRole("admin"), createProject).get(getProjects);
router.put("/:id/members", requireRole("admin"), updateProjectMembers);

module.exports = router;
