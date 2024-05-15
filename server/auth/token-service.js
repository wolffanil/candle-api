const jwt = require("jsonwebtoken");
const { promisify } = require("util");

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async validateAccessToken(token) {
    const userData = await promisify(jwt.verify)(
      token,
      process.env.JWT_ACCESS_SECRET
    );
    return userData;
  }

  async validateRefreshToken(token) {
    const userData = await promisify(jwt.verify)(
      token,
      process.env.JWT_REFRESH_SECRET
    );
    return userData;
  }
}

module.exports = new TokenService();
