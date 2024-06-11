import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { Button } from "../components/Button";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      Hello World
      <Button>Hello World</Button>
      <Button className="bg-lightBlue">Hello World</Button>
      <Button className="bg-darkYellow">Hello World</Button>
      <Button className="bg-red">Hello World</Button>
    </main>
  );
}
