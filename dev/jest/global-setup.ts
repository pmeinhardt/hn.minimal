/* eslint-disable no-console */

import { Chance } from "chance";

export default () => {
  process.env.SEED = process.env.SEED || new Chance().hash();
  console.log(`\nRandomized with SEED='${process.env.SEED}'\n`);
};
