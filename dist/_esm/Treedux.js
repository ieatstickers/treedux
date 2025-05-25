"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Treedux = void 0;
var _toolkit = require("@reduxjs/toolkit");
var _DefaultActionEnum = require("./Enum/DefaultActionEnum");
var _Objects = require("./Utility/Objects");
// Reducer map for Redux store

class Treedux {
  subscribers = new Set();
  constructor(dataStores, options) {
    this.dataStores = dataStores;
    options = options || {};
    const reducerMap = {};

    // For each data store
    for (const key in this.dataStores) {
      // Get the data store instance
      const dataStore = this.dataStores[key];
      // Set redux on the data store
      dataStore.setTreedux(this);
      // Add reducer the reducer maps
      reducerMap[key] = (0, _toolkit.createReducer)(dataStore.getInitialState(), builder => {
        Object.entries(dataStore.getReducers()).forEach(([actionType, reducer]) => builder.addCase(actionType, reducer));
      });
    }

    // Combine all data store reducers to create app reducer
    const appReducer = (0, _toolkit.combineReducers)(reducerMap);

    // Define root reducer
    const rootReducer = (state, action) => {
      if (action.type === _DefaultActionEnum.DefaultActionEnum.BATCH) {
        return action.payload.reduce(rootReducer, state);
      } else if (action.type === _DefaultActionEnum.DefaultActionEnum.SET_BY_KEY_PATH) {
        const {
          keyPath,
          value
        } = action.payload;
        return _Objects.Objects.setByKeyPath(keyPath, value, state);
      } else if (action.type === _DefaultActionEnum.DefaultActionEnum.DELETE_BY_KEY_PATH) {
        const {
          keyPath
        } = action.payload;
        return _Objects.Objects.setByKeyPath(keyPath, undefined, state);
      }
      return appReducer(state, action);
    };
    this.storeInstance = (0, _toolkit.configureStore)({
      reducer: rootReducer,
      preloadedState: options.initialState
    });
    this.storeInstance.subscribe(() => this.notifySubscribers());
  }
  static init(dataStores, options) {
    return new Treedux(dataStores, options);
  }
  get state() {
    const storeObj = {};
    for (const key in this.dataStores) {
      storeObj[key] = this.dataStores[key].state;
    }
    return storeObj;
  }
  getState() {
    return this.storeInstance.getState();
  }
  subscribe(subscriber) {
    this.subscribers.add(subscriber);
    return () => this.subscribers.delete(subscriber);
  }
  dispatch(...actions) {
    this.storeInstance.dispatch({
      type: _DefaultActionEnum.DefaultActionEnum.BATCH,
      payload: actions.map(action => action.serialize())
    });
  }
  notifySubscribers() {
    this.subscribers.forEach(subscriber => subscriber());
  }
}
exports.Treedux = Treedux;