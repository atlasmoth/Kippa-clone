import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";
import { connectToDatabase } from "./../utils/db";
import Monthly from "../components/monthly";

import Layout from "./../components/Layout";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Table from "./../components/table";

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
      <div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              Total Balance <br />
              &#x20A6;{" "}
              {overview.reduce((a, doc) => {
                if (doc._id === "in") a = a + doc.total;
                if (doc._id === "out") a = a - doc.total;
                return a;
              }, 0)}
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <span>Daily Balance </span> <br />
              <span>
                &#x20A6;{" "}
                {dailySummary.reduce((a, doc) => {
                  if (doc._id === "in") a = a + doc.total;
                  if (doc._id === "out") a = a - doc.total;
                  return a;
                }, 0)}
              </span>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Monthly categories={byCategory} />
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Button variant="outlined" color="secondary">
                <Link href="/transactions/out">
                  <a>Money out</a>
                </Link>
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className={classes.paper}>
              <Button variant="outlined" color="primary">
                <Link href="/transactions/in">
                  <a>Money in</a>
                </Link>
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12}></Grid>
          <Grid item xs={12}>
            <Table
              daily={dailySummary}
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
