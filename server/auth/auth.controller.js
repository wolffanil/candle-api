const User = require("../user/user.model");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const tokenService = require("./token-service");

class AuthController {
  register = catchAsync(async (req, res, next) => {
    const { name, surname, phone, password } = req.body;

    const existUser = await User.findOne({ name }).lean();

    if (existUser)
      return next(
        new AppError("Пользователь с таким именем уже существует", 400)
      );

    const user = await User.create({ name, surname, phone, password });

    this.createSendToken(user, 201, res, req);
  });

  login = catchAsync(async (req, res, next) => {
    const { name, password } = req.body;

    if (!name || !password)
      return next(new AppError("Пожалуйста придоставьте имя и пароль", 400));

    const user = await User.findOne({ name }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Неверное имя или пароль", 401));
    }

    this.createSendToken(user, 200, res, req);
  });

  refresh = catchAsync(async (req, res, next) => {
    const refreshToken = req.body.refreshToken;

    if (!refreshToken) {
      return next(
        new AppError(
          "Вы не авторизованы! Пожалуйста, войдите, чтобы получить доступ. ",
          401
        )
      );
    }

    const userData = await tokenService.validateRefreshToken(refreshToken);
    if (!userData) {
      return next(
        new AppError(
          "Вы не авторизованы! Пожалуйста, войдите, чтобы получить доступ. ",
          401
        )
      );
    }

    const user = await User.findById(userData.id).lean();

    this.createSendToken(user, 200, res, req);
  });

  createSendToken = (user, statusCode, res, req) => {
    const tokens = tokenService.generateTokens({
      id: user._id,
      role: user.role,
    });

    user.password = undefined;

    res.status(statusCode).json({
      ...tokens,
      user,
    });
  };
}

module.exports = new AuthController();
