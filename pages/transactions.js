import { useEffect, useState } from "react";
import axios from "axios";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export default function Transactions() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  useEffect(() => {
    console.log(date);
  }, [date]);
  return (
    <div className="transactions">
      <div className="container">
        <div>
          <label htmlFor="date">Select Range</label>
          <input type="date" name="" id="" />
        </div>
      </div>
    </div>
  );
}
