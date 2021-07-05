import { useEffect, useState } from "react";
import axios from "axios";

export default function Customer({ id }) {
  const [uniqueDebt, setUniqueDebt] = useState();
  const [update, setUpdate] = useState({});
  useEffect(() => {
    axios
      .get(`/api/debt?id=${id}`)
      .then(({ data: { docs } }) => {
        setUniqueDebt(docs);
      })
      .catch(console.log);
  }, [update]);
  function resolve(state) {
    const objId = state._id;
    delete state._id;
    axios
      .post("/api/transactions", {
        ...state,
        date: new Date().getTime(),
      })
      .then(async () => {
        await axios.put("/api/debt?id=" + objId, { ...state });
      })
      .catch(console.log);
  }
  return (
    <div className="customer">
      {uniqueDebt &&
        uniqueDebt[0].items.map((u) => (
          <div key={u._id}>
            <p>{u.type}</p>
            <p>{u.item}</p>
            <p>{u.total}</p>
            <p>Due in {new Date(u.date).toDateString()}</p>
            <button onClick={() => resolve(u)}>Resolve</button>
          </div>
        ))}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { id } = ctx.query;

  return {
    props: {
      id,
    },
  };
}
