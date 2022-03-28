import Ably from "ably/promises";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!process.env.ABLY_API_KEY) {
    res.status(500).json({
      error: "No ABLY_API_KEY",
    });
    return;
  }
  const clientId = req.query.clientId as string;
  console.log(req.query.clientId);
  if (!clientId) {
    res.status(500).json({
      error: "No cleint ID",
    });
    return;
  }
  const client = new Ably.Realtime(process.env.ABLY_API_KEY);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId,
  });
  res.status(200).json(tokenRequestData);
}
