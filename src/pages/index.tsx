import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <main className={`flex min-h-screen p-24 ${inter.className}`}>
      <p>Nothing to see here...</p>
    </main>
  );
}
