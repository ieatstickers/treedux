import { DataStore } from "./DataStore";
import { StateNode } from "./StateNode";
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

describe("DataStore", () => {
  
  describe("constructor", () => {
    
    it("correctly sets internal properties", () => {
      const initialState = { test: true };
      const mutators = {};
      const dataStore = new DataStore("test", { initialState: initialState, mutators: mutators })
      expect(dataStore.KEY).toBe("test");
      expect(dataStore['initialState']).toBe(initialState);
      expect(dataStore['mutators']).toBe(mutators);
    });
    
  });
  
  describe("create", () => {
    
    it("returns a DataStore instance", () => {
      const dataStore = DataStore.create("test", { initialState: {}, mutators: {} })
      expect(dataStore).toBeInstanceOf(DataStore);
    })
    
  });
  
  describe("state", () => {
    
    it("returns a StateNode instance", () => {
      const dataStore = DataStore.create("test", { initialState: {}, mutators: {} })
      dataStore.setTreedux({} as any);
      expect(dataStore.state).toBeInstanceOf(StateNode);
    });
    
    it("allows traversal of the state tree", () => {
      interface StateInterface {
        example: {
          nested: {
            prop: string
          }
        },
        anotherExample: boolean
      }
      const dataStore = DataStore.create<StateInterface>("test", { initialState: { example: null, anotherExample: false }, mutators: {} })
      dataStore.setTreedux({} as any);
      expect(dataStore.state.example.nested.prop).toBeInstanceOf(StateNode);
      expect(dataStore.state.anotherExample).toBeInstanceOf(StateNode);
    });
    
  });
  
  describe("setTreedux", () => {
    
    it("correctly sets the treedux property", () => {
      const dataStore = DataStore.create("test", { initialState: {}, mutators: {} })
      const treedux = {} as any;
      dataStore.setTreedux(treedux);
      expect(dataStore['treedux']).toEqual(treedux);
    });
    
  });
  
  describe("setHooks", () => {
    
    it("correctly sets the hooks property", () => {
      const dataStore = DataStore.create("test", { initialState: {}, mutators: {} })
      const hooks = {} as any;
      dataStore.setHooks(hooks);
      expect(dataStore['hooks']).toEqual(hooks);
    });
    
  });
  
  describe("getInitialState", () => {
    
    it("returns the initial state", () => {
      const initialState = { test: true };
      const dataStore = DataStore.create("test", { initialState: initialState, mutators: {} })
      expect(dataStore.getInitialState()).toEqual(initialState);
    });
    
  });
  
  describe("getReducers", () => {
    
    it("returns an object with action types as keys and reduce functions as values", () => {
      
      const dataStore = DataStore.create("test", {
        initialState: {}, mutators: {
          example: (treedux) => new ExampleMutator(treedux)
        }
      });
      expect(dataStore.getReducers()).toEqual({
        example: expect.any(Function)
      });
      expect(dataStore.getReducers().example).toBe(ExampleMutator.prototype.reduce);
    });
  });
  

  it("errors when duplicate action types are found", () => {
    
    const dataStore = DataStore.create("test", {
      initialState: {}, mutators: {
        example: (treedux) => new ExampleMutator(treedux),
        anotherExample: {
          example: (treedux) => new ExampleMutator(treedux)
        }
      }
    });
    expect(() => dataStore.getReducers()).toThrow(`Cannot add reducer. Action type already registered: example`);
    
  });
});
