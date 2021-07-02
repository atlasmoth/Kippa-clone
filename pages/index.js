import { useUser } from "@auth0/nextjs-auth0";
import { useRouter } from "next/router";

export default function Index() {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (!isLoading && !user) {
    console.log("this is running son");
  }

  if (error) return <div>{error.message}</div>;

  if (user) router.push("/account");

  return <a href="/api/auth/login">Login</a>;
}

async function getServerSideProps() {
  return {
    props: {
      user: null,
    },
  };
}
