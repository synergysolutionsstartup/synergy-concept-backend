import jwt, { SignOptions } from "jsonwebtoken";

export const signJwtToken = (
  payload: any,
  name: string,
  jwtKeys: Record<string, any>,
  jwtExpiry: Record<string, any>,
  isExpire: boolean = false
) => {
  try {
    const secret = getTokenSecret(name, jwtKeys);
    if (!secret) throw "Invalid token name";
    const data = { data: payload, name };
    if (!isExpire) {
      const result = jwt.sign(data, secret);
      return { data: result };
    }

    const expiry = getJwtExpiry(name, jwtKeys, jwtExpiry);
    const options: SignOptions | undefined = { expiresIn: expiry };
    const result = jwt.sign(data, secret, options);
    return { data: result };
  } catch (error) {
    console.error("JWT sign error", error);
    return { error };
  }
};

export const verifyJwtToken = (
  token: any,
  name: string,
  jwtKeys: Record<string, any>
) => {
  try {
    const secret = getTokenSecret(name, jwtKeys);
    if (!secret) throw "Invalid token name";
    const decoded = jwt.verify(token, secret) as Record<string, any>;
    return { data: decoded.data };
  } catch (error) {
    console.error("JWT verify error", error);
    return { error: error };
  }
};

const getJwtExpiry = (
  name: string,
  jwtKeys: Record<string, any>,
  jwtExpiry: Record<string, any>
): any => {
  // type must be a union of access refresh, signup, login, reset-password
  if (name == jwtKeys.access) return jwtExpiry.access;
  if (name == jwtKeys.refresh) return jwtExpiry.refresh;
  if (name == jwtKeys.resetPass) return jwtExpiry.resetPass;
  return jwtExpiry.auth;
};

const getTokenSecret = (name: string, jwtKeys: Record<string, any>) => {
  // type must be a union of access refresh, signin, reset-password
  if (name == jwtKeys.access) return process.env.JWT_ACCESS_SECRET;
  if (name == jwtKeys.refresh) return process.env.JWT_REFRESH_SECRET;
  if (name == jwtKeys.auth || name == jwtKeys.resetPass)
    return process.env.JWT_ACCESS_SECRET;
  return null;
};
