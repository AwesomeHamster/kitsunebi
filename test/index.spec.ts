import { expect } from "chai";

import { start } from "../src/index";

describe("Index", () => {
  it("Throw!", () => {
    expect(() => start("config")).to.throw();
  });
});
