const Project = require("../models/Project");
const Task = require("../models/Task");
const asyncHandler = require("../utils/asyncHandler");

const emptyStatusCounts = () => ({
  "To Do": 0,
  "In Progress": 0,
  Done: 0
});

const getDashboard = asyncHandler(async (req, res) => {
  const taskFilter =
    req.user.role === "admin"
      ? {
          projectId: {
            $in: await Project.find({
              $or: [{ createdBy: req.user._id }, { members: req.user._id }]
            }).distinct("_id")
          }
        }
      : { assignedTo: req.user._id };

  const [totalTasks, statusGroups, tasksPerUserGroups, overdueTasks] =
    await Promise.all([
      Task.countDocuments(taskFilter),
      Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: "$status", count: { $sum: 1 } } }
      ]),
      Task.aggregate([
        { $match: taskFilter },
        { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 0,
            userId: "$user._id",
            name: "$user.name",
            email: "$user.email",
            count: 1
          }
        },
        { $sort: { count: -1, name: 1 } }
      ]),
      Task.find({
        ...taskFilter,
        status: { $ne: "Done" },
        dueDate: { $lt: new Date() }
      })
        .populate("projectId", "name")
        .populate("assignedTo", "name email role")
        .sort({ dueDate: 1 })
    ]);

  const tasksByStatus = statusGroups.reduce((counts, item) => {
    counts[item._id] = item.count;
    return counts;
  }, emptyStatusCounts());

  return res.status(200).json({
    success: true,
    message: "Dashboard retrieved",
    data: {
      totalTasks,
      tasksByStatus,
      tasksPerUser: tasksPerUserGroups,
      overdueTasks
    }
  });
});

module.exports = { getDashboard };
