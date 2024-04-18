import { AbstractMutator } from "./AbstractMutator";

class ExampleMutator extends AbstractMutator<string>
{
  public getType(): string
  {
    return "example";
  }
  
  public getAction(...args: any): any
  {
    return {
      type: "example",
      payload: args
    };
  }
  
  public reduce(state: any, action: any): void
  {
    return;
  }
}

describe("AbstractMutator", () => {

  describe("constructor", () => {
    
    it("correctly sets the treedux property", () => {
      const treedux = {} as any;
      const mutator = new ExampleMutator(treedux);
      expect(mutator['treedux']).toBe(treedux);
    });
    
  });

});
