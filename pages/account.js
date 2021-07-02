import { useUser } from "@auth0/nextjs-auth0";
// import { connectToDatabase } from "./../utils/db";
import { getSession } from "@auth0/nextjs-auth0";

export default function Account() {
  const { user, error } = useUser();

  if (error) return <div>{error.message}</div>;

  if (user) {
    console.log(user);
    return (
      <div>
        Welcome {user.name}! <a href="/api/auth/logout">Logout</a>
      </div>
    );
  }
  return <h3>Hello kids</h3>;
}

export async function getServerSideProps(ctx) {
  const { user } = getSession(ctx.req, ctx.res);
  console.log(user);
  return {
    props: {},
  };
}
