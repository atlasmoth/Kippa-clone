import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import Link from "next/link";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [update, setUpdate] = useState({});
  const [phone, setPhone] = useState();

  useEffect(() => {
    axios
      .get("/api/customers")
      .then(({ data: { docs } }) => {
        console.log(docs);
        setCustomers(docs);
      })
      .catch(console.log);
  }, [update]);

  function handleSubmit(e) {
    e.preventDefault();
    const state = Object.fromEntries(new FormData(e.target));
    axios
      .post("/api/customers", { ...state, phone })
      .then(() => {
        setUpdate((u) => ({ ...u, type: "get" }));
      })
      .catch(console.log);
  }
  return (
    <div className="customers">
      <div className="container">
        <h3>Customers</h3>
        <div className="customer-list">
          {customers.map((c) => (
            <CustomerItem c={c} key={c._id} />
          ))}
        </div>
        <div className="create-customer">
          <p>Create New Customer</p>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label" htmlFor="name">
                Enter customer's name
              </label>
              <input type="text" name="name" id="name" />
            </div>
            <div>
              <div className="label">Mobile Number</div>
              <PhoneInput
                country={"us"}
                value={phone}
                onChange={(e) => setPhone(e)}
              />
            </div>
            <div>
              <span>
                <button type="submit">Save</button>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CreateDebt({ customer }) {
  function handleDebt(e) {
    e.preventDefault();
    const state = Object.fromEntries(new FormData(e.target));

    axios
      .post("/api/debt", {
        ...state,
        amount: parseFloat(state.amount),
        customer: customer._id,
        date: new Date(new Date(state.due).setHours(0, 0, 0, 0)).getTime(),
      })
      .then(({ data: { doc } }) => {
        console.log(doc);
      })
      .catch(console.log);
  }
  return (
    <div className="debt">
      <form onSubmit={handleDebt}>
        <div>
          <label htmlFor="type" className="label"></label>
          <select name="type" id="type">
            <optgroup label="Choose Transaction type">
              <option value="in">Credit</option>
              <option value="out">Debit</option>
            </optgroup>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="items">
            Items Bought
          </label>
          <input type="text" name="items" id="items" />
        </div>
        <div>
          <label className="label" htmlFor="amount">
            Amount
          </label>
          <input type="number" name="amount" id="amount" />
        </div>
        <div>
          <label className="label" htmlFor="due">
            Due in
          </label>
          <input type="date" name="due" id="due" />
        </div>
        <div>
          <button type="submit">Save</button>
        </div>
      </form>
    </div>
  );
}

function CustomerItem({ c }) {
  const [showTransaction, setShowTransaction] = useState(false);

  return (
    <div className="customer-item">
      <p>
        <Link href={`/customers/${c._id}`}>
          <a>
            <span>{c.name} - </span>
            <span>{c.phone}</span>
          </a>
        </Link>
      </p>
      <p>
        <span>
          <button onClick={() => setShowTransaction(!showTransaction)}>
            Create Transaction
          </button>
        </span>
      </p>
      <div>{showTransaction && <CreateDebt customer={c} />}</div>
    </div>
  );
}
