const mongoose = require("mongoose");

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isValidEmail = (value) =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidDate = (value) => {
  if (!value) {
    return false;
  }

  const date = new Date(value);
  return !Number.isNaN(date.getTime());
};

module.exports = {
  isValidObjectId,
  isNonEmptyString,
  isValidEmail,
  isValidDate
};
