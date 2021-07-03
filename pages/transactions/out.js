import { useRouter } from "next/router";
import { getSession } from "@auth0/nextjs-auth0";
const data = [
  "advertising and promotion",
  "auto and truck expenses",
  "bank service charges",
  "blueprints and reproduction",
  "bond expense",
  "building and property security",
  "business licenses and permits",
  "commissions paid",
  "computer and internet expenses",
  "conferences and meetings",
  "chemicals purchased",
  "construction materials costs",
  "continuing education",
  "accounting fees",
  "legal fees",
  "contracted services",
  "depreciation expense",
  "dues and subscriptions",
  "equipment rental",
  "equipment rental for jobs",
  "special events",
  "facilities and equipment",
  "fertilizers and lime",
  "food purchases",
  "freight and shipping costs",
  "freight and trucking",
  "freight costs",
  "fuel for hired vehicles",
  "gasoline, fuel and oil",
  "general liability insurance",
  "life and disability insurance",
  "professional liability",
  "workers compensation",
  "equipment insurance",
  "interest expense",
  "janitorial expense",
  "job materials purchased",
  "laboratory fees",
  "landscaping and groundskeeping",
  "linens and lodging supplies",
  "marketing expense",
  "materials costs",
  "meals and entertainment***",
  "media purchased for clients",
  "medical records and supplies",
  "merchant account fees",
  "ministry expenses",
  "office supplies",
  "other construction costs",
  "other job related costs",
  "outside services",
  "parts purchases",
  "payroll expenses",
  "postage and delivery",
  "printing and reproduction",
  "product samples expense",
  "professional fees",
  "purchases – hardware for resale",
  "purchases – parts and materials",
  "purchases – resale items",
  "purchases – software for resale",
  "reference materials",
  "rent expense",
  "repairs and maintenance",
  "research services",
  "restaurant supplies",
  "salon supplies, linens, laundry",
  "seeds and plants purchased",
  "shop expense",
  "small medical equipment",
  "small tools and equipment",
  "storage and warehousing",
  "subcontractors expense",
  "taxes – property",
  "telephone expense",
  "tools and small equipment",
  "travel and meetings",
  "conference, convention, meeting",
  "travel expense",
  "travel expenses for drivers",
  "truck maintenance costs",
  "uniforms",
  "utilities",
  "vaccines and medicines",
  "worker’s compensation insurance",
  "email",
];
export default function Create({ user }) {
  const router = useRouter();
  function createOut(e) {
    e.preventDefault();
    console.log(user);
    console.log(Object.fromEntries(new FormData(e.target)));
  }
  return (
    <div className="create">
      <div className="container">
        <p>
          <span onClick={() => router.back()}>
            <i className="fas fa-arrow-left"></i>
          </span>
          <span>Record Money Out</span>
        </p>
        <form onSubmit={createOut}>
          <div>
            <label className="label" htmlFor="sum">
              Amount
            </label>
            <input
              type="number"
              name="sum"
              id="sum"
              min="0"
              defaultValue="0"
              required
            />
          </div>
          <div>
            <label htmlFor="item" className="label">
              Item
            </label>
            <input type="text" name="item" id="item" required />
          </div>
          <div>
            <label htmlFor="category" className="label">
              Expense Category
            </label>
            <select name="category" id="category" required>
              <optgroup label="Choose Expense category">
                {data.map((d) => (
                  <option value={d} key={d}>
                    {d}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div>
            <p>Date</p>
            <span>
              <input
                type="date"
                name="date"
                id="date"
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </span>
            <span>
              <input type="time" name="time" id="time" />
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
          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { user } = getSession(ctx.req, ctx.res);
  return {
    props: { user },
  };
}
