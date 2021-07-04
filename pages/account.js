import { getSession } from "@auth0/nextjs-auth0";
import Link from "next/link";

import Monthly from "../components/monthly";
import Tabular from "./../components/tabular";
import { useData } from "./../contexts/dataContext";

export default function Account({ user }) {
  const {
    docs: [{ overview, byCategory, dailySummary }],
  } = useData();

  return (
    <div className="account">
      <div className="container">
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
        <Monthly categories={byCategory} />
        <div className="buttons">
          <span>
            <Link href="/transactions/out">
              <a>
                <button>Money Out</button>
              </a>
            </Link>
          </span>
          <span>
            <Link href="/transactions/in">
              <a>
                <button>Money In</button>
              </a>
            </Link>
          </span>
        </div>
        <Tabular />
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  const { user } = getSession(ctx.req, ctx.res);
  return {
    props: {
      user,
    },
  };
}
