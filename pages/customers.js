import { useState } from "react";

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  return (
    <div className="customers">
      <div className="containers">
        <h3>Hello, customers</h3>
        <div className="create-customer">
          <form>
            <div>
              <label htmlFor="name">Enter customer's name</label>
              <input type="text" name="name" id="name" />
            </div>
            <div></div>
          </form>
        </div>
      </div>
    </div>
  );
}
