import * as api from "./index";

describe("public API", () => {

  it("exports the expected surface", () => {
    expect(api.Treedux).toBeDefined();
    expect(api.DataStore).toBeDefined();
    expect(api.AbstractMutator).toBeDefined();
    expect(api.Action).toBeDefined();
    expect(api.StateNode).toBeDefined();
    expect(api.DefaultActionEnum).toBeDefined();
  });

});