import { Action } from "./Action";

describe("Action", () => {
  
  let treedux;
  let action: Action<string>;
  
  beforeEach(() => {
    treedux = { dispatch: jest.fn(), serialize: jest.fn() } as any;
    action = Action.create({ type: "test", payload: "payload" }, treedux);
  });
  
  describe("constructor", () => {
    
    it("correctly sets internal properties", () => {
      expect(action.type).toBe("test");
      expect(action.payload).toBe("payload");
      expect(action['treedux']).toBe(treedux);
    });
    
  });
  
  describe("dispatch", () => {
    
    it("calls treedux.dispatch", () => {
      action.dispatch();
      expect(treedux.dispatch).toHaveBeenCalledWith(action);
    });
    
  });
  
  describe("serialize", () => {
    
    it("returns an object with type and payload", () => {
      expect(action.serialize()).toEqual({ type: "test", payload: "payload" });
    });
    
  });

});
