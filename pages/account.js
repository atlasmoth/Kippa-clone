import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { connectToDatabase } from "./../utils/db";
import Monthly from "../components/monthly";
import Tabular from "./../components/tabular";
import Layout from "./../components/Layout";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

export default function Account({ user, docs }) {
  const [{ overview, dailySummary, byCategory }] = docs;
  const classes = useStyles();

  return (
    <Layout>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            Total Balance <br />
            &#x20A6;{" "}
            {overview.reduce((a, doc) => {
              if (doc._id === "in") a = a + doc.total;
              if (doc._id === "out") a = a - doc.total;
              return a;
            }, 0)}
          </Grid>
          <Grid item xs={6}>
            <span>Daily Balance </span> <br />
            <span>
              &#x20A6;{" "}
              {dailySummary.reduce((a, doc) => {
                if (doc._id === "in") a = a + doc.total;
                if (doc._id === "out") a = a - doc.total;
                return a;
              }, 0)}
            </span>
          </Grid>
          <Grid item xs={12}>
            <Monthly categories={byCategory} />
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" color="secondary">
              <Link href="/transactions/out">
                <a>Money out</a>
              </Link>
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button variant="outlined" color="primary">
              <Link href="/transactions/in">
                <a>Money in</a>
              </Link>
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Tabular
              data={dailySummary
                .filter((d) => d._id === "in" || d._id === "out")
                .reduce((acc, curr) => {
                  return [...acc, ...curr.items];
                }, [])}
            />
          </Grid>
        </Grid>
      </div>
    </Layout>
  );
}

// export default function Account() {

//   return (
//     <Layout>
//       <div className="buttons">
//         <div>

//         </div>
//         <div>

//         </div>
//       </div>

//       <div className="overview">
//         <div>
//           <span>Date</span> <br />
//           <span>{new Date().toDateString()}</span>
//         </div>
//         <div>
//           <span>Cash in</span> <br />
//           <span>
//             &#x20A6;{dailySummary.find((d) => d._id === "in")?.total || 0}
//           </span>
//         </div>
//         <div>
//           <span>Cash out</span> <br />
//           <span>
//             &#x20A6;{dailySummary.find((d) => d._id === "out")?.total || 0}
//           </span>
//         </div>
//       </div>

//     </Layout>
//   );
// }

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
