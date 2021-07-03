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
  const { user } = getSession(req, res);
  try {
    const { db } = await connectToDatabase();
    const {
      ops: [doc],
    } = await db
      .collection("transactions")
      .insertOne({ ...req.body, creator: user.sub });
    res.send({ success: true, doc });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }

  res.send();
}
async function updateTransaction(req, res) {
  res.send();
}

handler.get(getTransactions).post(createTransaction);
export default handler;
