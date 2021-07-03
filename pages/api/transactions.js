import { connectToDatabase } from "./../../utils/db";

import { getSession } from "@auth0/nextjs-auth0";
import nc from "next-connect";

const handler = nc();
async function getTransactions(req, res) {
  const { user } = getSession(req, res);
  // console.log(user);
  res.send(user);
}
async function createTransaction(req, res) {
  res.send();
}
async function updateTransaction(req, res) {
  res.send();
}

handler.get(getTransactions);
export default handler;
