import { useEffect, useState } from "react";
import axios from "axios";

export default function Customer({ id }) {
  const [uniqueDebt, setUniqueDebt] = useState();
  const [update, setUpdate] = useState({});

  useEffect(() => {
    axios
      .get(`/api/debt?id=${id}`)
      .then(({ data: { docs } }) => {
        setUniqueDebt(
          docs
            .filter((d) => d._id === "in" || d._id === "out")
            .reduce((acc, curr) => {
              return [...acc, ...curr.items];
            }, [])
        );
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
        setUpdate((u) => ({ ...u, type: "get" }));
      })
      .catch(console.log);
  }
  return (
    <div className="customer">
      {uniqueDebt &&
        uniqueDebt.map((u) => (
          <div key={u._id}>
            <p>
              <span>{u.item} </span>
              <span
                style={{ color: `${u.type === "in" ? "green" : "tomato"}` }}
              >
                &#x20A6; {u.amount}
              </span>
            </p>

            <p>Due on {new Date(u.date).toDateString()}</p>
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
