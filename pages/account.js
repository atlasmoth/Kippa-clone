import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { connectToDatabase } from "./../utils/db";
import Monthly from "../components/monthly";
import Tabular from "./../components/tabular";
import Navbar from "../components/navbar";

export default function Account({ user, docs }) {
  const [{ overview, dailySummary, byCategory }] = docs;

  return (
    <div className="account">
      <Navbar />
      <div className="container">
        <div className="buttons">
          <div>
            Total Balance <br />
            &#x20A6;{" "}
            {overview.reduce((a, doc) => {
              if (doc._id === "in") a = a + doc.total;
              if (doc._id === "out") a = a - doc.total;
              return a;
            }, 0)}
          </div>
          <div>
            <span>Daily Balance </span> <br />
            <span>
              &#x20A6;{" "}
              {dailySummary.reduce((a, doc) => {
                if (doc._id === "in") a = a + doc.total;
                if (doc._id === "out") a = a - doc.total;
                return a;
              }, 0)}
            </span>
          </div>
        </div>
        <Monthly categories={byCategory} />
        <div className="buttons">
          <span>
            <Link href="/transactions/out">
              <a>
                <button className="btn">Money Out</button>
              </a>
            </Link>
          </span>
          <span>
            <Link href="/transactions/in">
              <a>
                <button className="btn">Money In</button>
              </a>
            </Link>
          </span>
        </div>
        <div className="overview">
          <div>
            <span>Date</span> <br />
            <span>{new Date().toDateString()}</span>
          </div>
          <div>
            <span>Cash in</span> <br />
            <span>{dailySummary.find((d) => d._id === "in")?.total || 0}</span>
          </div>
          <div>
            <span>Cash out</span> <br />
            <span>{dailySummary.find((d) => d._id === "out")?.total || 0}</span>
          </div>
        </div>
        <Tabular
          data={dailySummary
            .filter((d) => d._id === "in" || d._id === "out")
            .reduce((acc, curr) => {
              return [...acc, ...curr.items];
            }, [])}
        />
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
