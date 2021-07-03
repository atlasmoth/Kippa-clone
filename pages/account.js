import { useUser, getSession } from "@auth0/nextjs-auth0";
import { connectToDatabase } from "./../utils/db";
import { useEffect } from "react";
import axios from "axios";
import Monthly from "../components/monthly";
import Tabular from "./../components/tabular";

export default function Account() {
  const { user } = useUser();
  useEffect(() => {
    axios.get("/api/transactions").then(console.log).catch(console.log);
  }, []);

  if (user) {
    console.log(user);
    return (
      <div className="account">
        <div className="container">
          Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
          <Monthly />
          <div className="buttons">
            <span>
              <button>Money Out</button>
            </span>
            <span>
              <button>Money In</button>
            </span>
          </div>
          <Tabular />
        </div>
      </div>
    );
  }
  return <h3>Hello kids</h3>;
}

export async function getServerSideProps(ctx) {
  const { user } = getSession(ctx.req, ctx.res);
  const { db } = await connectToDatabase();
  const userDoc = await db.collection("peoples").findOne({ sub: user?.sub });
  console.log(userDoc);
  return {
    props: {},
  };
}
