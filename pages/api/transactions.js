// import { connectToDatabase } from "./../../utils/db";

import { getSession } from "@auth0/nextjs-auth0";
import nc from "next-connect";

const handler = nc();
async function getTransactions(req, res) {
  const { user } = getSession(req, res);
  console.log(user);
  res.send(user);
}

export default handler;
