import { useEffect, useState } from "react";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { connectToDatabase } from "./../utils/db";
import { getSession } from "@auth0/nextjs-auth0";
import Layout from "./../components/Layout";

export default function Transaction({ docs }) {
  const [transactions, setTransactions] = useState([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  useEffect(() => {
    const [{ startDate, endDate }] = state;
    // console.log(new Date(startDate));
    const most = new Date(
      new Date(endDate.toDateString()).setHours(23, 59, 59, 59)
    ).getTime();
    const least = new Date(
      new Date(startDate.toDateString()).setHours(0, 0, 0, 0)
    ).getTime();

    axios
      .get(`/api/history?most=${most}&least=${least}`)
      .then(({ data: { docs } }) => {
        setTransactions(docs);
      })
      .catch(console.log);
  }, [state]);
  console.log(transactions);
  return (
    <Layout>
      <DateRangePicker
        onChange={(item) => setState([item.selection])}
        showSelectionPreview={true}
        moveRangeOnFirstSelection={false}
        months={1}
        ranges={state}
        direction="vertical"
        scroll={{ enabled: true }}
        maxDate={new Date()}
        minDate={docs?.date ? new Date(docs.date) : new Date()}
      />
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { user } = getSession(ctx.req, ctx.res);
  const { db } = await connectToDatabase();
  const [docs] = await db
    .collection("transactions")
    .aggregate([
      {
        $match: {
          creator: user.sub,
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
      {
        $limit: 1,
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
