const Project = require("../models/Project");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { isNonEmptyString, isValidObjectId } = require("../utils/validators");

const createProject = asyncHandler(async (req, res) => {
  const { name, description, members = [] } = req.body;

  if (!isNonEmptyString(name)) {
    return res.status(400).json({
      success: false,
      message: "Project name is required",
      data: {}
    });
  }

  if (!Array.isArray(members) || members.some((id) => !isValidObjectId(id))) {
    return res.status(400).json({
      success: false,
      message: "Members must be an array of valid user ids",
      data: {}
    });
  }

  const uniqueMembers = [...new Set([req.user._id.toString(), ...members])];
  const foundMembers = await User.find({ _id: { $in: uniqueMembers } }).select("_id");

  if (foundMembers.length !== uniqueMembers.length) {
    return res.status(400).json({
      success: false,
      message: "One or more members do not exist",
      data: {}
    });
  }

  const project = await Project.create({
    name,
    description,
    createdBy: req.user._id,
    members: uniqueMembers
  });

  const populatedProject = await project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" }
  ]);

  return res.status(201).json({
    success: true,
    message: "Project created",
    data: { project: populatedProject }
  });
});

const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    $or: [{ createdBy: req.user._id }, { members: req.user._id }]
  })
    .populate("createdBy", "name email role")
    .populate("members", "name email role")
    .sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    message: "Projects retrieved",
    data: { projects }
  });
});

const updateProjectMembers = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, action } = req.body;

  if (!isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "Valid project id is required",
      data: {}
    });
  }

  if (!isValidObjectId(userId) || !["add", "remove"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Valid userId and action of add or remove are required",
      data: {}
    });
  }

  const project = await Project.findById(id);
  if (!project) {
    return res.status(404).json({
      success: false,
      message: "Project not found",
      data: {}
    });
  }

  const member = await User.findById(userId).select("_id");
  if (!member) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      data: {}
    });
  }

  const memberSet = new Set(project.members.map((memberId) => memberId.toString()));

  if (action === "add") {
    memberSet.add(userId);
  }

  if (action === "remove") {
    if (project.createdBy.toString() === userId) {
      return res.status(400).json({
        success: false,
        message: "Project creator cannot be removed from members",
        data: {}
      });
    }
    memberSet.delete(userId);
  }

  project.members = [...memberSet];
  await project.save();

  const populatedProject = await project.populate([
    { path: "createdBy", select: "name email role" },
    { path: "members", select: "name email role" }
  ]);

  return res.status(200).json({
    success: true,
    message: "Project members updated",
    data: { project: populatedProject }
  });
});

module.exports = { createProject, getProjects, updateProjectMembers };
