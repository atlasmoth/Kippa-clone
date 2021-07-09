import { connectToDatabase } from "./../../utils/db";
export default function Debt({ data }) {
  return <div className="debt">{JSON.stringify(data, null, 2)}</div>;
}

export async function getServerSideProps(ctx) {
  const { params } = ctx;
  try {
    const { db } = await connectToDatabase();

    const docs = await db.collection("debt").findOne({ _id: params.id });

    return {
      props: {
        data: JSON.parse(JSON.stringify(docs)),
      },
    };
  } catch (error) {
    return {
      props: {
        data: null,
      },
    };
  }
}
