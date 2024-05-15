const APIFeatures = require("../utils/apiFeatures");
const Candle = require("./candle.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

class CandleController {
  getAll = catchAsync(async (req, res, next) => {
    const filter = {};

    const features = new APIFeatures(Candle.find(filter), req.query)
      .filters()
      .sort()
      .limitfields()
      .page();

    const candles = await features.query;

    res.status(200).json({
      candles,
    });
  });

  getById = catchAsync(async (req, res, next) => {
    const candleId = req.params.id;

    if (!candleId) return next(new AppError("Id свечи должен быть", 404));

    const candle = await Candle.findById(candleId).lean();

    if (!candle) return next(new AppError("Cвеча небыла найдена", 400));

    res.status(200).json({
      candle,
    });
  });

  create = catchAsync(async (req, res, next) => {
    const candle = await Candle.create({ ...req.body });

    res.status(201).json({
      candle,
    });
  });

  deleteById = catchAsync(async (req, res, next) => {
    const candleId = req.params.id;

    if (!candleId) return next(new AppError("Id свечи должен быть", 404));

    await Candle.findByIdAndDelete(candleId);

    res.status(200).json({
      status: "success",
    });
  });

  updateById = catchAsync(async (req, res, next) => {
    const candleId = req.params.id;

    if (!candleId) return next(new AppError("Id свечи должен быть", 404));

    const candle = await Candle.findByIdAndUpdate(
      candleId,
      { ...req.body },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ candle });
  });
}

module.exports = new CandleController();
