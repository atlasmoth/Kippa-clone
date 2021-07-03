import "../styles/globals.css";
import Head from "next/head";
import { DataProvider } from "./../contexts/dataContext";
import { UserProvider } from "@auth0/nextjs-auth0";

export default function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <DataProvider>
        <Head>
          <title>Kippa Clone</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
          />
        </Head>
        <Component {...pageProps} />
      </DataProvider>
    </UserProvider>
  );
}
