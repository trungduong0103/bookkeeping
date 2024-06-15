import Link from "next/link";
import Head from "next/head";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <title>Bookkeeper</title>
      </Head>
      <nav className="w-full m-auto py-5 px-10 bg-grey">
        <ol className="flex gap-3">
          <li className="underline font-bold">
            <Link href="/authors">Authors</Link>
          </li>
          <li className="underline font-bold">
            <Link href="/books">Books</Link>
          </li>
        </ol>
      </nav>
      <main className="flex flex-col gap-3 w-full md:max-w-[100ch] m-auto py-10">
        {children}
      </main>
    </>
  );
}
