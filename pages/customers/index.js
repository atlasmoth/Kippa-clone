import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import Link from "next/link";
import Navbar from "../../components/navbar";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [update, setUpdate] = useState({});
  const [phone, setPhone] = useState();
  const [balance, setbalance] = useState(0);

  useEffect(() => {
    axios
      .get("/api/customers")
      .then(({ data: { docs } }) => {
        const total = docs.reduce((acc, { debt }) => {
          return (
            acc +
            debt.reduce((a, doc) => {
              if (doc.type === "in") a = a + doc.amount;
              if (doc.type === "out") a = a - doc.amount;
              return a;
            }, 0)
          );
        }, 0);
        setbalance(total);
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
      <Navbar />
      <div className="container">
        <div className="customer-box">
          <div className="container-header">
            <h3>Customers</h3>
            <p>Total &#x20A6; {balance}</p>
          </div>
          <div className="customer-list">
            {customers.map((c) => (
              <CustomerItem c={c} key={c._id} updateState={setUpdate} />
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
                  <button className="btn" type="submit">
                    Save
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function CreateDebt({ customer, setUpdate, closeTransaction }) {
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
        setUpdate((u) => ({ ...u, type: "get" }));
        closeTransaction();
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
          <label className="label" htmlFor="item">
            Items Bought
          </label>
          <input type="text" name="item" id="items" />
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
          <button className="btn" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}

function CustomerItem({ c, updateState }) {
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
          <button
            className="btn"
            onClick={() => setShowTransaction(!showTransaction)}
          >
            Record Debt
          </button>
        </span>
      </p>
      <div>
        {showTransaction && (
          <CreateDebt
            customer={c}
            setUpdate={updateState}
            closeTransaction={() => setShowTransaction(!showTransaction)}
          />
        )}
      </div>
    </div>
  );
}
