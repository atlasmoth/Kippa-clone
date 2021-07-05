import { connectToDatabase } from "./../../utils/db";
import { getSession } from "@auth0/nextjs-auth0";
import nc from "next-connect";

const handler = nc({ attachParams: true });

async function getCustomers(req, res) {
  let query = {};
  const { user } = getSession(req, res);
  const { db } = await connectToDatabase();
  const { id } = req.query;

  query.creator = user.sub;
  if (id) {
    query.customer = id;
  }

  const docs = await db
    .collection("debt")
    .aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          items: { $push: "$$ROOT" },
        },
      },
    ])
    .toArray();
  res.send({ success: true, docs });
}

async function createDebt(req, res) {
  const { user } = getSession(req, res);
  try {
    const { db } = await connectToDatabase();
    const {
      ops: [doc],
    } = await db
      .collection("debt")
      .insertOne({ ...req.body, creator: user.sub });
    res.send({ success: true, doc });
  } catch (error) {
    res.status(400).send({ success: false, message: error.message });
  }

  res.send();
}
handler.get(getCustomers).post(createDebt);
export default handler;
