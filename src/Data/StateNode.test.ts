import { StateNode } from "./StateNode";
import { Treedux } from "../Treedux";
import { Action } from "./Action";
import { DataStore } from "./DataStore";
import { AbstractMutator } from "./AbstractMutator";

class TestStateNode extends StateNode<any, any, any>
{
  public constructor(
    options: any,
    treedux: Treedux
  )
  {
    super(options, treedux);
  }
}

class ExampleMutator extends AbstractMutator<any>
{
  public getType(): string
  {
    return "example";
  }
  
  public getAction(...args): Action<any>
  {
    return Action.create(
      {
        type:    this.getType(),
        payload: args
      },
      this.treedux
    );
  }
  
  public reduce(state: any, action: any): any
  {
    return state;
  }
}

describe("StateNode", () => {
  
  describe("constructor", () => {

    it("correctly sets internal properties", () => {

      const treedux = { bind: jest.fn() } as any;
      const keyPath = ['example', 'path'];
      const mutators = {};
      const stateNode = new TestStateNode({ keyPath: keyPath, mutators: mutators }, treedux);

      expect(stateNode['treedux']).toBe(treedux);
      expect(stateNode['keyPath']).toBe(keyPath);
      expect(stateNode['mutators']).toBe(mutators);
    });

  });

  describe("create", () => {

    it("returns a StateNode instance", () => {
      const treedux = jest.mock("../Treedux") as unknown as Treedux;
      const keyPath = ['example', 'path'];
      const stateNode = StateNode.create({ keyPath: keyPath }, treedux);
      expect(stateNode).toBeInstanceOf(StateNode);
    });

  });

  describe("get", () => {

    it("returns the value at the key path", () => {
        const treedux = {
          getState: jest.fn().mockReturnValue({ example: { path: 'value' } })
        } as any;
        const keyPath = ['example', 'path'];
        const stateNode = StateNode.create({ keyPath: keyPath }, treedux);

        expect(stateNode.get()).toBe('value');
    });

    it("returns null if the key path does not exist", () => {

      const treedux = {
        getState: jest.fn().mockReturnValue({ example: { path: 'value' } })
      } as any;
      const keyPath = ['example', 'doesNotExist'];
      const stateNode = StateNode.create({ keyPath: keyPath }, treedux);

      expect(stateNode.get()).toBe(null);

    });

    it("returns the state if the key path is empty", () => {

        const treedux = {
          getState: jest.fn().mockReturnValue({ example: { path: 'value' } })
        } as any;
        const keyPath = [];
        const stateNode = StateNode.create({ keyPath: keyPath }, treedux);

        expect(stateNode.get()).toEqual({ example: { path: 'value' } });
    });

  });

  describe("set", () => {

    it("returns an action with the key path and value", () => {
      
      const treedux = jest.mock("../Treedux") as unknown as Treedux;
      const keyPath = ['example', 'path'];
      const stateNode = StateNode.create({ keyPath: keyPath }, treedux);
      const setAction = stateNode.set('newValue');

      expect(setAction).toBeInstanceOf(Action);
      expect(setAction).toEqual({
        type: '__SET_BY_KEY_PATH__',
        payload: {
          keyPath: keyPath,
          value: 'newValue'
        },
        treedux: treedux
      });

    });

  });
  
  describe("byKey", () => {

    it("returns an action with the key path and value", () => {
      
      const treedux = jest.mock("../Treedux") as unknown as Treedux;
      const keyPath = ['example'];
      const stateNode = StateNode.create({ keyPath: keyPath }, treedux);
      const childNode = stateNode.byKey('anotherKey' as never);
      expect(childNode).toBeInstanceOf(StateNode);
    
    });
    
    it("throws an error if you don't pass it a key", () => {
      
      const treedux = jest.mock("../Treedux") as unknown as Treedux;
      const keyPath = ['example'];
      const stateNode = StateNode.create({ keyPath: keyPath }, treedux);
      expect(() => stateNode.byKey(undefined as never)).toThrow();
      
    });

  });
  
  describe("delete", () => {
    type TestStateNodeType = {
      example: {
        [key: string]: boolean
      }
    }
    
    it("returns an action with the key path and value", () => {
      
      const treedux = jest.mock("../Treedux") as unknown as Treedux;
      const keyPath = ['test'];
      const options = { keyPath: keyPath };
      const stateNode = StateNode.create<TestStateNodeType, { example: TestStateNodeType }, TestStateNodeType, typeof options>(options, treedux);
      const action = stateNode.example.byKey('test').delete();
      expect(action).toBeInstanceOf(Action);
      expect(action).toEqual({
        type: '__DELETE_BY_KEY_PATH__',
        payload: { keyPath: [ "test", "example", "test" ] },
        treedux: treedux
      });
      
    });
    
  });

  describe("subscribe", () => {

    it("registers subscriber callback with Redux", () => {

      const treedux = {
        subscribe: jest.fn()
      } as any;
      const keyPath = ['example', 'path'];
      const stateNode = StateNode.create({ keyPath: keyPath }, treedux);
      const callback = jest.fn();
      stateNode.subscribe(callback);
      expect(treedux.subscribe).toHaveBeenCalledTimes(1);

    });

    it("returns a function to unsubscribe the callback", () => {

        const unsubscriber = () => {};
        const treedux = {
          subscribe: jest.fn().mockReturnValue(unsubscriber)
        } as any;
        const keyPath = ['example', 'path'];
        const stateNode = StateNode.create({ keyPath: keyPath }, treedux);
        const callback = jest.fn();
        const unsubscribe = stateNode.subscribe(callback);
        expect(unsubscribe).toBe(unsubscriber);
    });

    it("calls the callback when the state changes", async () => {
      return new Promise((resolve) => {

        interface ExampleDataStoreInterface {
          someExample: boolean,
          anotherExample: string
        }
        const exampleDataStore = DataStore.create<ExampleDataStoreInterface>(
          'example',
          { initialState: { someExample: false, anotherExample: null } }
        );

        const treedux = Treedux.init(
          {
            example: exampleDataStore
          },
          { initialState: { example: { path: 'value' } } }
        );

        const subscriber = jest.fn();
        treedux.state.example.anotherExample.subscribe(subscriber);
        treedux.state.example.anotherExample.set("test string").dispatch();

        setTimeout(() => {
          expect(subscriber).toHaveBeenCalledTimes(1);
          expect(subscriber).toHaveBeenCalledWith("test string");
          resolve(true);
        }, 100);

      });
    });

    it("doesn't call the callback if the state hasn't changed", async () => {
      return new Promise(async (resolve) => {

        interface ExampleDataStoreInterface {
          someExample: boolean,
          anotherExample: string,
          data: {
            [key: number]: boolean
          }
        }
        const exampleDataStore = DataStore.create<ExampleDataStoreInterface>(
          'example',
          { initialState: { someExample: false, anotherExample: "test string", data: {} } }
        );

        const treedux = Treedux.init(
          {
            example: exampleDataStore
          },
          { initialState: { example: { path: 'value' } } }
        );

        const subscriber = jest.fn();
        treedux.state.example.anotherExample.subscribe(subscriber);
        treedux.dispatch(
          treedux.state.example.someExample.set(true),
          treedux.state.example.anotherExample.set("test string"),
          treedux.state.example.data.byKey(123).delete()
        );

        await (new Promise((resolve) => setTimeout(resolve, 100)));
        expect(subscriber).toHaveBeenCalledTimes(1);

        treedux.dispatch(
          treedux.state.example.someExample.set(false),
          treedux.state.example.anotherExample.set("test string"),
        );

        await (new Promise((resolve) => setTimeout(resolve, 100)));
        expect(subscriber).toHaveBeenCalledTimes(1);

        resolve(true);
      });
    });

  });
  
  describe("dynamic properties", () => {

      it("return null when non-string properties are accessed", () => {

        const treedux = {
          getState: jest.fn().mockReturnValue({ example: { path: 'value' } })
        } as any;
        const keyPath = ['example', 'path'];
        const stateNode = StateNode.create({ keyPath: keyPath }, treedux);

        expect(stateNode[Symbol('test')]).toBe(null);

      });

    it("return mutator method when name accessed", () => {

      class ExampleMutator extends AbstractMutator<any>
      {
        public getType(): string
        {
          return "example";
        }

        public getAction(...args): Action<any>
        {
          return Action.create(
            {
              type:    this.getType(),
              payload: args
            },
            this.treedux
          );
        }

        public reduce(state: any, action: any): any
        {
          return state;
        }
      }

      const treedux = {
        getState: jest.fn().mockReturnValue({ example: { path: 'hookValue' }} )
      } as any;
      const keyPath = ['example', 'path'];

      interface ExampleStateInterface
      {
        example: {
          path: string
        }
      }

      const options = {
        keyPath: keyPath,
        mutators: {
          example: {
            path: {
              myTestMutator: (treedux) => new ExampleMutator(treedux)
            }
          }
        }
      };

      const stateNode = StateNode.create<ExampleStateInterface, {}, ExampleStateInterface, typeof options>(
        options,
        treedux
      );

      const examplePathNode = stateNode.example.path;
      expect(examplePathNode.myTestMutator("some", "example", "args")).toEqual({ type: "example", payload: ["some", "example", "args"], treedux: treedux });
    });

    it("return mutator method when name accessed", () => {

      const treedux = {
        getState: jest.fn().mockReturnValue({ example: { path: 'hookValue' }} )
      } as any;
      const keyPath = ['example', 'path'];

      interface ExampleStateInterface
      {
        example: {
          path: string
        }
      }

      const options = {
        keyPath: keyPath,
        mutators: {
          example: {
            path: {
              myTestMutator: (treedux) => new ExampleMutator(treedux)
            }
          }
        }
      };

      const stateNode = StateNode.create<ExampleStateInterface, {}, ExampleStateInterface, typeof options>(
        options,
        treedux
      );

      const examplePathNode = stateNode.example.path;
      expect(examplePathNode.myTestMutator("some", "example", "args")).toEqual({ type: "example", payload: ["some", "example", "args"], treedux: treedux });
    });

  });

  describe("createProxy", () => {

    it("returns a proxy object", () => {
      const treedux = jest.mock("../Treedux") as unknown as Treedux;
      const keyPath = [ "example", "path" ];
      const stateNode = new TestStateNode({ keyPath: keyPath }, treedux);
      const proxy = stateNode["createProxy"]();
      expect(proxy['testProperty']).toBeInstanceOf(StateNode);
    });

  });

  describe("getMutatorMethod", () => {

      it("returns a mutator method if it exists", () => {

        const mutator = new ExampleMutator({} as any);

        const stateNode = new TestStateNode(
          {
            keyPath: [ "example", "path" ],
            mutators: {
              mutate: () => mutator
            }
          },
          {} as any
        );

        const mutatorMethod = stateNode['getMutatorMethod']('mutate');
        const boundActionCreator = mutator.getAction;
        boundActionCreator.bind(mutator);
        expect(mutatorMethod()).toEqual(boundActionCreator.call(mutator));
      });

      it("returns null if the mutator method does not exist", () => {

        const stateNode = new TestStateNode(
          {
            keyPath: [ "example", "path" ]
          },
          {} as any
        );
        const mutatorMethod = stateNode['getMutatorMethod']('mutate');
        expect(mutatorMethod).toBe(null);

      });
  });
  
});
