export type JWTPayload = {
  exp: number;
  iat?: number;
  [key: string]: any;
};

// JWT をデコードする
export const decodeJwt = (token: string): JWTPayload | null => {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
};

export const confirmTokenValid = (token: string): boolean => {
  const payload = decodeJwt(token);
  if (!payload || !payload.exp) {
    return false;
  }
  return payload.exp * 1000 > Date.now();
};