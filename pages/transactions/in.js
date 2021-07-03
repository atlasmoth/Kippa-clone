import axios from "axios";
import { useRouter } from "next/router";
import { useData } from "./../../contexts/dataContext";

export default function In() {
  const context = useData();
  const router = useRouter();
  function createOut(e) {
    e.preventDefault();
    const state = Object.fromEntries(new FormData(e.target));

    axios
      .post("/api/transactions", {
        ...state,
        date: new Date().toISOString(),
        sum: parseFloat(state.amount),
        type: "in",
        quantity: parseInt(state.quantity),
        amount: parseFloat(state.amount) * parseInt(state.quantity),
      })
      .then(() => {
        console.log("this is working son");
        context.setUpdate((s) => ({ ...s, type: "refresh" }));
        router.push("/account");
      })
      .catch(console.log);
  }
  return (
    <div className="in">
      <div className="container">
        <p>
          <span onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i>
          </span>
          <span>Record a new sale</span>
        </p>
        <form onSubmit={createOut}>
          <div>
            <label htmlFor="item">Item</label>
            <input type="text" name="item" id="item" />
          </div>
          <div>
            <span>
              <label htmlFor="amount">
                Amount( &#x20A6;)
                <input type="number" name="amount" />
              </label>
            </span>
            <span>
              <label htmlFor="Quantity">
                Quantity
                <input type="number" name="quantity" />
              </label>
            </span>
          </div>
          <div>
            <label htmlFor="cash">
              <input type="radio" name="method" value="cash" defaultChecked />
              Cash
            </label>
            <label htmlFor="pos">
              <input type="radio" name="method" value="pos" />
              POS
            </label>
            <label htmlFor="transfer">
              <input type="radio" name="method" value="transfer" />
              Transfer
            </label>
          </div>
          <div></div>
          <div>
            <button>Add Item</button>
          </div>
        </form>
      </div>
    </div>
  );
}
