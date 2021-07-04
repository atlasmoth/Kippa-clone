import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { connectToDatabase } from "./../utils/db";
import Monthly from "../components/monthly";
import Tabular from "./../components/tabular";

export default function Account({ user, docs }) {
  const [{ overview, dailySummary, byCategory }] = docs;

  return (
    <div className="account">
      <div className="container">
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
        <Monthly categories={byCategory} />
        <div className="buttons">
          <span>
            <Link href="/transactions/out">
              <a>
                <button>Money Out</button>
              </a>
            </Link>
          </span>
          <span>
            <Link href="/transactions/in">
              <a>
                <button>Money In</button>
              </a>
            </Link>
          </span>
        </div>
        <Tabular />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { user } = getSession(ctx.req, ctx.res);
  const { db } = await connectToDatabase();
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
          overview: [
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
                  $gte: new Date(new Date().setHours(0, 0, 0, 0)).getTime(),
                },
              },
            },
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
                items: { $push: "$$ROOT" },
              },
            },
          ],
          byCategory: [
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

  return {
    props: {
      user,
      docs: JSON.parse(JSON.stringify(docs)),
    },
  };
}
