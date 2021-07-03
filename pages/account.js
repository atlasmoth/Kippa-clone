import { getSession } from "@auth0/nextjs-auth0";
import { connectToDatabase } from "./../utils/db";
import { useEffect } from "react";
import Link from "next/link";

import Monthly from "../components/monthly";
import Tabular from "./../components/tabular";

export default function Account({ user, docs }) {
  useEffect(() => {
    console.log(JSON.parse(docs));
  }, []);

  return (
    <div className="account">
      <div className="container">
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
        <Monthly />
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

  return {
    props: {
      docs: JSON.stringify(docs),
      user,
    },
  };
}
