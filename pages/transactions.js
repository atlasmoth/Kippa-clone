import { useEffect, useState } from "react";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import { connectToDatabase } from "./../utils/db";
import { getSession } from "@auth0/nextjs-auth0";

export default function Transaction({ docs }) {
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
    console.log(new Date(startDate.toDateString()));
  }, [state]);
  return (
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
