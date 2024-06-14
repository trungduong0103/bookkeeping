import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Layout } from "./layout";

export const getServerSideProps = async () => {
  try {
    fetch("http://localhost:3000/generate-data");
  } catch (err) {
    console.log(err);
  }
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
