import { init } from "./src/pages/api/data-repository/Data.repository";
import { BOOKKEEPER_DATA } from "./src/mock/data";

export async function register() {
  const bookKeeper = init(BOOKKEEPER_DATA);
  console.log(bookKeeper);
}
