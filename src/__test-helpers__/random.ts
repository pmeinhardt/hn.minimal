import { Chance } from "chance";

const seed = process.env.SEED;

const generator = seed ? new Chance(seed) : new Chance();

export default generator;
