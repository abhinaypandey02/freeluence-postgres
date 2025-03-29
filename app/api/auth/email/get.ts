import type { NextRequest } from "next/server";
import {
  generateAccessToken,
  getTokenizedResponse,
  getUserIdFromRefreshToken,
} from "../../lib/auth/token";
import { ErrorResponses } from "../../lib/auth/error-responses";

export const GET = (req: NextRequest) => {
  const refresh = req.cookies.get("refresh")?.value;

  if (!process.env.REFRESH_KEY) return ErrorResponses.noRefreshKey;
  const userID = getUserIdFromRefreshToken(refresh);
  if (userID) return getTokenizedResponse(generateAccessToken(userID));

  return getTokenizedResponse();
};
