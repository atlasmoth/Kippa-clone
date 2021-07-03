import { connectToDatabase } from "./../../utils/db";

import { getSession } from "@auth0/nextjs-auth0";
import nc from "next-connect";

const handler = nc();
async function getTransactions(req, res) {
  const { user } = getSession(req, res);
  const { db } = await connectToDatabase();
  const pastThirtyDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    new Date().getDate()
  ).toISOString();

  const docs = await db
    .collection("transactions")
    .aggregate([
      {
        $match: {
          creator: user.sub,
        },
      },
      {
        $facet: {
          monthly: [
            {
              $match: {
                date: {
                  $gte: pastThirtyDays,
                },
              },
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ],
          dailySummary: [
            {
              $match: {
                date: {
                  $gt: new Date(new Date(Date.now() - 86400000)).toISOString(),
                },
              },
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ],
          dailyItems: [
            {
              $match: {
                date: {
                  $gt: new Date(new Date(Date.now() - 86400000)).toISOString(),
                },
              },
            },
          ],
          byCategoy: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
          ],
        },
      },
    ])
    .toArray();
  res.send({ success: true, docs });
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
