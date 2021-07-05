export default function Tabluar({ data }) {
  return (
    <div className="tabular">
      {data.map((d) => (
        <div className="item" key={d._id}>
          <span>
            {d.item} <br />
            <span>
              <small>
                {new Date(d.date).getHours()}:{new Date(d.date).getMinutes()}
              </small>
              <span> {d.method || "cash"}</span>
            </span>
          </span>
          <span style={{ color: `${d.type === "in" ? "green" : "tomato"}` }}>
            &#x20A6;{d.amount}
          </span>
        </div>
      ))}
    </div>
  );
}
