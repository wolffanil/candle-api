const express = require("express");
const {
  create,
  getAll,
  getById,
  deleteById,
  updateById,
} = require("./candle.controller");
const protect = require("../middlewares/auth.middleware");
const isAdmin = require("../middlewares/admin.middleware");

const router = express.Router();

router.route("/").get(getAll).post(protect, isAdmin, create);
router
  .route("/:id")
  .get(getById)
  .patch(protect, isAdmin, updateById)
  .delete(protect, isAdmin, deleteById);

module.exports = router;
