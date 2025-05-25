"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Action = void 0;
class Action {
  constructor(action, treedux) {
    this.type = action.type;
    this.payload = action.payload;
    this.treedux = treedux;
  }
  static create(action, treedux) {
    return new Action(action, treedux);
  }
  dispatch() {
    this.treedux.dispatch(this);
  }
  serialize() {
    return {
      type: this.type,
      payload: this.payload
    };
  }
}
exports.Action = Action;