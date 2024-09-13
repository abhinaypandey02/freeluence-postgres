import { sign, verify } from "jsonwebtoken";
import { NextResponse } from "next/server";

export function generateAccessToken(id: number) {
  if (process.env.SIGNING_KEY)
    return sign({ id }, process.env.SIGNING_KEY, {
      expiresIn: "2h",
    });
  return "";
}

export function generateRefreshToken(id: number) {
  if (process.env.REFRESH_KEY) return sign({ id }, process.env.REFRESH_KEY);
  return "";
}

export function getTokenizedResponse(
  accessToken?: string,
  refreshToken?: string,
) {
  const body = accessToken || null;
  const response = new NextResponse(body, {
    status: 200,
  });
  if (refreshToken !== undefined) {
    response.cookies.set("refresh", refreshToken, {
      secure: true,
      httpOnly: true,
      expires: refreshToken === "" ? 0 : undefined,
    });
  }
  return response;
}

export function getUserIdFromRefreshToken(
  refreshToken?: string,
): number | null {
  if (refreshToken && process.env.REFRESH_KEY)
    try {
      const decoded = verify(refreshToken, process.env.REFRESH_KEY);
      if (typeof decoded !== "string" && typeof decoded.id === "number")
        return decoded.id;
    } catch (e) {
      console.error(e, "errors");
      return null;
    }
  return null;
}

interface ParamState {
  refresh: string;
  redirectURL: string;
}

export function createState(data: ParamState) {
  return JSON.stringify(data);
}

export function getState(data: string) {
  return JSON.parse(data) as ParamState;
}
