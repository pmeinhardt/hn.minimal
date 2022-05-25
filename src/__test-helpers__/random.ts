import { Chance } from "chance";

export const SEED = process.env.SEED || new Chance().hash();

export default new Chance(SEED);
