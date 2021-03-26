import { expect } from "chai";

import { start } from "../src/index";

describe("index", () => {
  it("throw with invalid config", () => {
    expect(() => start("config")).to.throw();
  });
});
