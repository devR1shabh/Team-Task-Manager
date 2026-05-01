const Project = require("../models/Project");
const Task = require("../models/Task");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const {
  isNonEmptyString,
  isValidDate,
  isValidObjectId
} = require("../utils/validators");

const validStatuses = ["To Do", "In Progress", "Done"];
const validPriorities = ["low", "medium", "high"];

const populateTask = (query) =>
  query
    .populate("projectId", "name description")
    .populate("assignedTo", "name email role");

const createTask = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    projectId,
    assignedTo,
    status = "To Do",
    priority = "medium",
    dueDate
  } = req.body;

  if (
    !isNonEmptyString(title) ||
    !isValidObjectId(projectId) ||
    !isValidObjectId(assignedTo) ||
    !isValidDate(dueDate)
  ) {
    return res.status(400).json({
      success: false,
      message: "Title, valid projectId, valid assignedTo, and dueDate are required",
      data: {}
    });
  }

  if (!validStatuses.includes(status) || !validPriorities.includes(priority)) {
    return res.status(400).json({
      success: false,
      message: "Invalid status or priority",
      data: {}
    });
  }

  const [project, assignee] = await Promise.all([
    Project.findById(projectId),
    User.findById(assignedTo).select("_id name email role")
  ]);

  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      data: {}
    });
  }

  if (!assignee) {
    return res.status(404).json({
      success: false,
      message: "Assigned user not found",
      data: {}
    });
  }

  const isProjectMember = project.members.some(
    (memberId) => memberId.toString() === assignedTo
  );

  if (!isProjectMember) {
    return res.status(400).json({
      success: false,
      message: "Assigned user must be a project member",
      data: {}
    });
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo,
    status,
    priority,
    dueDate
  });

  const populatedTask = await populateTask(Task.findById(task._id));

  return res.status(201).json({
    success: true,
    message: "Task created",
    data: { task: populatedTask }
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "admin"
      ? {
          $or: [
            { assignedTo: req.user._id },
            {
              projectId: {
                $in: await Project.find({
                  $or: [{ createdBy: req.user._id }, { members: req.user._id }]
                }).distinct("_id")
              }
            }
          ]
        }
      : { assignedTo: req.user._id };

  const tasks = await populateTask(Task.find(query).sort({ createdAt: -1 }));

  return res.status(200).json({
    success: true,
    message: "Tasks retrieved",
    data: { tasks }
  });
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid task id is required",
      data: {}
    });
  }

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: "Status must be To Do, In Progress, or Done",
      data: {}
    });
  }

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
      data: {}
    });
  }

  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: "Only the assigned user can update this task status",
      data: {}
    });
  }

  task.status = status;
  await task.save();

  const populatedTask = await populateTask(Task.findById(task._id));

  return res.status(200).json({
    success: true,
    message: "Task status updated",
    data: { task: populatedTask }
  });
});

module.exports = { createTask, getTasks, updateTaskStatus };
