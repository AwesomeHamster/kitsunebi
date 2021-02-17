import { expect } from "chai";

import { start } from "../src/index";
import { OicqAdapter } from "../src/adapter";

describe("index", () => {
  it("throw with invalid config", () => {
    expect(() => start("config")).to.throw();
  });
});
