import*as t from"@reduxjs/toolkit";var e={d:(t,r)=>{for(var s in r)e.o(r,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:r[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},r={};e.d(r,{c9:()=>l,aU:()=>c,KT:()=>d,Nj:()=>i,nu:()=>h,fO:()=>u});const s=(a={combineReducers:()=>t.combineReducers,configureStore:()=>t.configureStore,createReducer:()=>t.createReducer},o={},e.d(o,a),o);var a,o,i;!function(t){t.BATCH="__BATCH__",t.SET_BY_KEY_PATH="__SET_BY_KEY_PATH__"}(i||(i={}));class n{static isObject(t){return"object"==typeof t&&null!==t}static setByKeyPath(t,e,r){if(0===t.length)throw new Error("Key path should not be empty.");const s=[...t],a=this.deepCopy(r);let o=a;for(;s.length>0;){const t=s.shift();if(0===s.length){void 0===e?delete o[t]:o[t]=e;break}if(!o[t]){if(void 0===e)return a;o[t]={}}o=o[t]}return a}static deepCopy(t){if("object"!=typeof t||null===t)return t;const e=Array.isArray(t)?[]:{};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=this.deepCopy(t[r]));return e}}class u{constructor(t,e){this.dataStores=t,e=e||{};const r={};for(const t in this.dataStores){const e=this.dataStores[t];e.setTreedux(this),r[t]=(0,s.createReducer)(e.getInitialState(),(t=>{Object.entries(e.getReducers()).forEach((([e,r])=>t.addCase(e,r)))}))}const a=(0,s.combineReducers)(r),o=(t,e)=>{if(e.type===i.BATCH)return e.payload.reduce(o,t);if(e.type===i.SET_BY_KEY_PATH){const{keyPath:r,value:s}=e.payload;return n.setByKeyPath(r,s,t)}return a(t,e)};this.storeInstance=(0,s.configureStore)({reducer:o,preloadedState:e.initialState})}static init(t,e){return new u(t,e)}get state(){if(!this.storeInstance)throw"Cannot get store. Redux store has not been initialized.";const t={};for(const e in this.dataStores)t[e]=this.dataStores[e].state;return t}getState(){if(!this.storeInstance)throw"Cannot get state. Redux store has not been initialized.";return this.storeInstance.getState()}subscribe(t){if(!this.storeInstance)throw"Cannot subscribe to store. Redux store has not been initialized.";return this.storeInstance.subscribe(t)}dispatch(...t){if(!this.storeInstance)throw"Cannot dispatch action. Redux store has not been initialized.";this.storeInstance.dispatch({type:i.BATCH,payload:t.map((t=>t.serialize()))})}}class c{constructor(t,e){this.type=t.type,this.payload=t.payload,this.treedux=e}static create(t,e){return new c(t,e)}dispatch(){this.treedux.dispatch(this)}serialize(){return{type:this.type,payload:this.payload}}}class h{constructor(t,e){this.keyPath=[],this.treedux=e,this.keyPath=t.keyPath,this.mutators=t.mutators}static create(t,e){return new h(t,e).createProxy()}get(){const t=[...this.keyPath],e=this.treedux.getState();if(0===t.length)return e;let r=e;for(;t.length>0;){const e=t.shift();if(!n.isObject(r)||void 0===r[e])return this.lastKnownValue=null,this.lastKnownValue;r=r[e]}return this.lastKnownValue=r,this.lastKnownValue}set(t){return c.create({type:i.SET_BY_KEY_PATH,payload:{keyPath:this.keyPath,value:t}},this.treedux)}subscribe(t){let e=this.lastKnownValue;return this.treedux.subscribe((()=>{const r=this.get();JSON.stringify(r)!==JSON.stringify(e)&&(e=r,t(e))}))}byKey(t){if(!t)throw"Key must be provided to byKey method.";return h.create({keyPath:this.keyPath.concat([t.toString()]),mutators:this.mutators},this.treedux)}createProxy(){return new Proxy(this,{get(t,e){if("string"!=typeof e)return null;return t.getMutatorMethod(e)||("function"==typeof t[e]?t[e].bind(t):h.create({keyPath:t.keyPath.concat(e),mutators:t.mutators&&t.mutators[e]?t.mutators[e]:{}},t.treedux))}})}getMutatorMethod(t){if(!this.mutators||!this.mutators.hasOwnProperty(t)||"function"!=typeof this.mutators[t])return null;const e=(0,this.mutators[t])(this.treedux);return e.getAction.bind(e)}getMutatorMethods(){const t=this.mutators||{},e={};for(const r in t)e[r]=this.getMutatorMethod(r);return e}}class d{constructor(t,e){this.KEY=t,this.initialState=e.initialState,this.mutators=e.mutators}static create(t,e){return new d(t,e)}get state(){const t={keyPath:[this.KEY],mutators:this.mutators};return h.create(t,this.treedux)}setTreedux(t){return this.treedux=t,this}getInitialState(){return this.initialState}getReducers(){return this.hydrateReducersFromMutators({},this.mutators)}hydrateReducersFromMutators(t,e){for(const r in e){const s=e[r];if("object"==typeof s)this.hydrateReducersFromMutators(t,s);else{if(t[r])throw`Cannot add reducer. Action type already registered: ${r}`;const e=s(this.treedux);t[e.getType()]=e.reduce}}return t}}class l{constructor(t){this.treedux=t}}var y=r.c9,p=r.aU,f=r.KT,b=r.Nj,g=r.nu,m=r.fO;export{y as AbstractMutator,p as Action,f as DataStore,b as DefaultActionEnum,g as StateNode,m as Treedux};
//# sourceMappingURL=index.mjs.map