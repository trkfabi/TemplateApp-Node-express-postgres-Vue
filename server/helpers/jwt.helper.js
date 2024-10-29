import jwt from "jsonwebtoken";

const generateJwtAuthToken = (payload) => {
  const expiration = "7d";
  const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Expira en 7d
  const newPayload = { ...payload, exp: expirationDate };
  return {
    accessToken: jwt.sign(newPayload, process.env.JWT_AUTHTOKEN_SECRET, {
      //expiresIn: expiration,
    }),
    expirationDate,
  };
};

const verifyJwtAuthToken = (token) => {
  const response = jwt.verify(token, process.env.JWT_AUTHTOKEN_SECRET);
  return response;
};

const generateJwtRefreshToken = (payload) => {
  const expiration = "365d";
  const expirationDate = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365; // Expira en 365 dias
  const newPayload = { ...payload, exp: expirationDate };
  return {
    refreshToken: jwt.sign(newPayload, process.env.JWT_REFRESHTOKEN_SECRET, {
      //expiresIn: expiration,
    }),
    expirationDate,
  };
};

const verifyJwtRefreshToken = (token) => {
  const response = jwt.verify(token, process.env.JWT_REFRESHTOKEN_SECRET);
  return response;
};

export const JwtHelper = {
  generateJwtAuthToken,
  verifyJwtAuthToken,
  generateJwtRefreshToken,
  verifyJwtRefreshToken,
};
