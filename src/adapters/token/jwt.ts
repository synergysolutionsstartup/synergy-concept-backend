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
    // console.log('decoded token data', decoded);
    return { data: decoded.data };
  } catch (error) {
    // console.log("verify jwt error ", error);
    return { error: error };
  }
};

const getJwtExpiry = (
  name: string,
  jwtKeys: Record<string, any>,
  jwtExpiry: Record<string, any>
): any => {
  // type must be a union of access refresh, signup, login
  if (name == jwtKeys.access) return jwtExpiry.access;
  if (name == jwtKeys.refresh) return jwtExpiry.refresh;
  return jwtExpiry.auth;
};

const getTokenSecret = (name: string, jwtKeys: Record<string, any>) => {
  // type must be a union of access refresh, signin
  if (name == jwtKeys.access) return process.env.JWT_SECRET_ACCESS;
  if (name == jwtKeys.refresh) return process.env.JWT_SECRET_REFRESH;
  if (name == jwtKeys.auth) return process.env.JWT_SECRET_AUTH;
  return null;
};
