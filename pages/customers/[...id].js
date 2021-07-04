import { useEffect, useState } from "react";
import axios from "axios";

export default function Customer({ id }) {
  const [uniqueDebt, setUniqueDebt] = useState([]);
  const [update, setUpdate] = useState({});
  useEffect(() => {
    axios
      .get(`/api/debt?id=${id}`)
      .then(({ data: { docs } }) => {
        console.log(docs);
      })
      .catch(console.log);
  }, [update]);
  return <div className="customer"></div>;
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;

  return {
    props: {
      id,
    },
  };
}
