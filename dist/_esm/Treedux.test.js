"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TestDataStore = exports.InvalidDataStore = void 0;
var _DataStore = require("./Data/DataStore");
var _AbstractMutator = require("./Data/AbstractMutator");
var _Action = require("./Data/Action");
var _Treedux = require("./Treedux");
// UserStore.ts

class IncrementMutator extends _AbstractMutator.AbstractMutator {
  getType() {
    return "notifications/increment";
  }
  getAction(incrementBy = 1) {
    return _Action.Action.create({
      type: this.getType(),
      payload: incrementBy
    }, this.treedux);
  }
  reduce(state, action) {
    state.incrementableNumeric += action.payload;
  }
}
const initialState = {
  user: {
    name: "John McClane",
    age: 32
  },
  incrementableNumeric: 0,
  dynamicObject: {
    example: {
      exampleNested: true
    }
  },
  prefs: []
};
class TestDataStore {
  static KEY = "test";
  static mutators = {
    incrementableNumeric: {
      increment: treedux => new IncrementMutator(treedux)
    }
  };
  static create() {
    return _DataStore.DataStore.create(TestDataStore.KEY, {
      initialState: initialState,
      mutators: this.mutators
    });
  }
}
exports.TestDataStore = TestDataStore;
class InvalidDataStore {
  static KEY = "invalid";
  static mutators = {
    // Registers the same action type twice
    incrementableNumeric: {
      increment: treedux => new IncrementMutator(treedux),
      decrement: treedux => new IncrementMutator(treedux)
    }
  };
  static create() {
    return _DataStore.DataStore.create(TestDataStore.KEY, {
      initialState: initialState,
      mutators: this.mutators
    });
  }
}
exports.InvalidDataStore = InvalidDataStore;
describe("Treedux", () => {
  describe("DataStore", () => {
    it("throws an error if two mutators with the same action type are registered in the same data store", () => {
      expect(() => _Treedux.Treedux.init({
        invalid: InvalidDataStore.create()
      })).toThrow();
    });
  });
  describe("StateNode", () => {
    describe("get", () => {
      it("returns data store defaults by default", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        expect(treedux.state.test.get()).toEqual(initialState);
      });
      it("returns correct state for dynamically accessed nodes", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.dynamicObject.byKey("example").byKey("exampleNested");
        expect(node.get()).toEqual(true);
      });
      it("correctly retrieves arrays", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.prefs;
        expect(node.get()).toEqual([]);
      });
    });
    describe("set", () => {
      it("updates the state for any type-hinted node", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const userNode = treedux.state.test.user;

        // Update user object
        userNode.set({
          name: "Jane Doe",
          age: 29
        }).dispatch();
        expect(userNode.get()).toEqual({
          name: "Jane Doe",
          age: 29
        });
        expect(userNode.name.get()).toEqual("Jane Doe");
        expect(userNode.age.get()).toEqual(29);

        // Update user name
        userNode.name.set("John Doe").dispatch();
        expect(userNode.name.get()).toEqual("John Doe");
        expect(userNode.get()).toEqual({
          name: "John Doe",
          age: 29
        });

        // Update user age
        userNode.age.set(30).dispatch();
        expect(userNode.age.get()).toEqual(30);
        expect(userNode.get()).toEqual({
          name: "John Doe",
          age: 30
        });
      });
      it("updates the state for dynamically accessed nodes", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.dynamicObject.byKey("test").byKey("nonExistentKey");
        expect(node.get()).toEqual(undefined);
        node.set(true).dispatch();
        expect(node.get()).toEqual(true);
      });
      it("correctly sets arrays", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.prefs;
        node.set(["one", "two", "three"]).dispatch();
        expect(node.get()).toEqual(["one", "two", "three"]);
      });
    });
    describe("subscribe", () => {
      it("calls subscriber when value changes (and ONLY when value changes)", async () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const userSubscriber = jest.fn();
        const nameSubscriber = jest.fn();
        const ageSubscriber = jest.fn();
        const userUnsubscribe = treedux.state.test.user.subscribe(userSubscriber);
        const nameUnsubscribe = treedux.state.test.user.name.subscribe(nameSubscriber);
        const ageUnsubscribe = treedux.state.test.user.age.subscribe(ageSubscriber);
        treedux.state.test.user.set({
          name: "Jane Doe",
          age: 29
        }).dispatch();
        treedux.state.test.user.name.set("John Doe").dispatch();
        treedux.state.test.user.age.set(30).dispatch();
        expect(userSubscriber).toHaveBeenCalledTimes(3);
        expect(nameSubscriber).toHaveBeenCalledTimes(2);
        expect(ageSubscriber).toHaveBeenCalledTimes(2);
        userUnsubscribe();
        nameUnsubscribe();
        ageUnsubscribe();
      });
      it("calls subscriber for dynamically accessed nodes", async () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const subscriber = jest.fn();
        const node = treedux.state.test.dynamicObject.byKey("test").byKey("exampleKey");

        // Ensure the node is undefined to begin with
        expect(node.get()).toEqual(undefined);
        const unsubscribe = node.subscribe(subscriber);
        node.set(false).dispatch();
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(false);
        treedux.state.test.dynamicObject.byKey("test").set({
          exampleKey: true
        }).dispatch();
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber).toHaveBeenCalledWith(true);
        treedux.state.test.dynamicObject.byKey("test").delete().dispatch();
        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(subscriber).toHaveBeenCalledWith(undefined);
        unsubscribe();
      });
    });
    describe("byKey", () => {
      it("throws an error if no key is provided", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        expect(() => treedux.state.test.dynamicObject.byKey(undefined)).toThrow();
      });
    });
    describe("delete", () => {
      it("removes the node from the state", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.dynamicObject.byKey("example");
        node.delete().dispatch();
        expect(node.get()).toEqual(undefined);
      });
      it("returns gracefully if node being deleted doesn't exist", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.dynamicObject.byKey("nonExistentKey").byKey("anotherNonExistentKey");
        node.delete().dispatch();
        expect(node.get()).toEqual(undefined);
      });
    });
    describe("custom mutators", () => {
      it("mutators registered in data store and type-hinted and perform the ", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const incrementable = treedux.state.test.incrementableNumeric;
        incrementable.increment(4).dispatch();
        expect(incrementable.get()).toEqual(4);
        incrementable.increment(2).dispatch();
        expect(incrementable.get()).toEqual(6);
        incrementable.increment().dispatch();
        expect(incrementable.get()).toEqual(7);
      });
      it("throws an error if accessor isn't a string", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const response = treedux.state.test[Symbol("invalid")];
        expect(response).toBe(null);
      });
    });
  });
  describe("ReadOnlyStateNode", () => {
    describe("get", () => {
      it("returns data store defaults by default", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        expect(treedux.state.test.toReadOnly().get()).toEqual(initialState);
      });
      it("returns correct state for dynamically accessed nodes", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const node = treedux.state.test.toReadOnly().dynamicObject.byKey("example").byKey("exampleNested");
        expect(node.get()).toEqual(true);
      });
    });
    describe("subscribe", () => {
      it("calls subscriber when value changes (and ONLY when value changes)", async () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const userSubscriber = jest.fn();
        const nameSubscriber = jest.fn();
        const ageSubscriber = jest.fn();
        const userUnsubscribe = treedux.state.test.user.toReadOnly().subscribe(userSubscriber);
        const nameUnsubscribe = treedux.state.test.user.name.toReadOnly().subscribe(nameSubscriber);
        const ageUnsubscribe = treedux.state.test.user.age.toReadOnly().subscribe(ageSubscriber);
        treedux.state.test.user.set({
          name: "Jane Doe",
          age: 29
        }).dispatch();
        treedux.state.test.user.name.set("John Doe").dispatch();
        treedux.state.test.user.age.set(30).dispatch();
        expect(userSubscriber).toHaveBeenCalledTimes(3);
        expect(nameSubscriber).toHaveBeenCalledTimes(2);
        expect(ageSubscriber).toHaveBeenCalledTimes(2);
        userUnsubscribe();
        nameUnsubscribe();
        ageUnsubscribe();
      });
      it("calls subscriber for dynamically accessed nodes", async () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const subscriber = jest.fn();
        const node = treedux.state.test.dynamicObject.byKey("test").byKey("exampleKey");

        // Ensure the node is undefined to begin with
        expect(node.get()).toEqual(undefined);
        const unsubscribe = node.toReadOnly().subscribe(subscriber);
        node.set(false).dispatch();
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(subscriber).toHaveBeenCalledWith(false);
        treedux.state.test.dynamicObject.byKey("test").set({
          exampleKey: true
        }).dispatch();
        expect(subscriber).toHaveBeenCalledTimes(2);
        expect(subscriber).toHaveBeenCalledWith(true);
        treedux.state.test.dynamicObject.byKey("test").delete().dispatch();
        expect(subscriber).toHaveBeenCalledTimes(3);
        expect(subscriber).toHaveBeenCalledWith(undefined);
        unsubscribe();
      });
    });
    describe("byKey", () => {
      it("throws an error if no key is provided", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        expect(() => treedux.state.test.dynamicObject.toReadOnly().byKey(undefined)).toThrow();
      });
    });
    describe("mutators", () => {
      it("throw errors when mutations are attempted", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const incrementable = treedux.state.test.incrementableNumeric.toReadOnly();

        // Mutator methods shouldn't be type-hinted anyway (hence the ts-ignores)
        // but we want to test that it's not just types that are preventing mutations (methods should not be available)
        // @ts-ignore
        expect(() => incrementable.set(10)).toThrow();
        // @ts-ignore
        expect(() => incrementable.increment()).toThrow();
        const dynamic = treedux.state.test.dynamicObject.byKey("example").byKey("test").toReadOnly();

        // @ts-ignore
        expect(() => dynamic.delete()).toThrow();
      });
      it("throws an error if accessor isn't a string", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const response = treedux.state.test.toReadOnly()[Symbol("invalid")];
        expect(response).toBe(null);
      });
    });
  });
  describe("Treedux", () => {
    describe("dispatch", () => {
      it("correctly batches multiple actions", () => {
        const treedux = _Treedux.Treedux.init({
          test: TestDataStore.create()
        });
        const subscriber = jest.fn();
        treedux.subscribe(subscriber);
        treedux.dispatch(treedux.state.test.user.name.set("First"), treedux.state.test.user.name.set("Second"), treedux.state.test.user.name.set("Third"));
        expect(subscriber).toHaveBeenCalledTimes(1);
        expect(treedux.state.test.user.name.get()).toBe("Third");
      });
    });
  });
});