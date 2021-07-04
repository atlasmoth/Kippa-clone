import { useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [update, setUpdate] = useState({});
  const [phone, setPhone] = useState();

  useEffect(() => {
    axios
      .get("/api/customers")
      .then(({ data: { docs } }) => {
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
      <div className="containers">
        <h3>Customers</h3>
        <div className="customer-list">
          {customers.map((c) => (
            <div className="customer-item" key={c._id}>
              <p>
                <span>{c.name} - </span>
                <span>{c.phone}</span>
              </p>
            </div>
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

function CreateDebt({ type }) {
  function handleDebt(e) {
    e.preventDefault();
    const state = Object.fromEntries(new FormData(e.target));
    console.log(state);
    console.log({ type });
  }
  return (
    <div className="debt">
      <form>
        <div>
          <label htmlFor="items">Items Bought</label>
          <input type="text" name="items" id="items" />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input type="number" name="amount" id="amount" />
        </div>
        <div>
          <label htmlFor="due">Due in</label>
          <input type="date" name="due" id="due" />
        </div>
      </form>
    </div>
  );
}
