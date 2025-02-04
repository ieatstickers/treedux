(()=>{"use strict";var t={d:(e,r)=>{for(var s in r)t.o(r,s)&&!t.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:r[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{AbstractMutator:()=>h,Action:()=>o,DataStore:()=>c,DefaultActionEnum:()=>s,StateNode:()=>u,Treedux:()=>i});const r=require("@reduxjs/toolkit");var s;!function(t){t.BATCH="__BATCH__",t.SET_BY_KEY_PATH="__SET_BY_KEY_PATH__",t.DELETE_BY_KEY_PATH="__DELETE_BY_KEY_PATH__"}(s||(s={}));class a{static isObject(t){return"object"==typeof t&&null!==t}static setByKeyPath(t,e,r){const s=[...t],a=this.deepCopy(r);let i=a;for(;s.length>0;){const t=s.shift();if(0===s.length){void 0===e?delete i[t]:i[t]=e;break}if(!i[t]){if(void 0===e)return a;i[t]={}}i=i[t]}return a}static deepCopy(t){if("object"!=typeof t||null===t)return t;const e=Array.isArray(t)?[]:{};for(const r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=this.deepCopy(t[r]));return e}}class i{constructor(t,e){this.dataStores=t,e=e||{};const i={};for(const t in this.dataStores){const e=this.dataStores[t];e.setTreedux(this),i[t]=(0,r.createReducer)(e.getInitialState(),(t=>{Object.entries(e.getReducers()).forEach((([e,r])=>t.addCase(e,r)))}))}const o=(0,r.combineReducers)(i),n=(t,e)=>{if(e.type===s.BATCH)return e.payload.reduce(n,t);if(e.type===s.SET_BY_KEY_PATH){const{keyPath:r,value:s}=e.payload;return a.setByKeyPath(r,s,t)}if(e.type===s.DELETE_BY_KEY_PATH){const{keyPath:r}=e.payload;return a.setByKeyPath(r,void 0,t)}return o(t,e)};this.storeInstance=(0,r.configureStore)({reducer:n,preloadedState:e.initialState})}static init(t,e){return new i(t,e)}get state(){const t={};for(const e in this.dataStores)t[e]=this.dataStores[e].state;return t}getState(){return this.storeInstance.getState()}subscribe(t){return this.storeInstance.subscribe(t)}dispatch(...t){this.storeInstance.dispatch({type:s.BATCH,payload:t.map((t=>t.serialize()))})}}class o{constructor(t,e){this.type=t.type,this.payload=t.payload,this.treedux=e}static create(t,e){return new o(t,e)}dispatch(){this.treedux.dispatch(this)}serialize(){return{type:this.type,payload:this.payload}}}class n{constructor(t,e){this.keyPath=[],this.treedux=e,this.keyPath=t.keyPath}static create(t,e){return new n(t,e).createProxy()}get(){const t=[...this.keyPath];let e=this.treedux.getState();for(;t.length>0;){const r=t.shift();if(!a.isObject(e))return this.lastKnownValue=void 0,this.lastKnownValue;e=e[r]}return this.lastKnownValue=e,this.lastKnownValue}subscribe(t){let e=this.lastKnownValue;return this.treedux.subscribe((()=>{const r=this.get();JSON.stringify(r)!==JSON.stringify(e)&&(e=r,t(e))}))}byKey(t){if(!t)throw"Key must be provided to byKey method.";return n.create({keyPath:this.keyPath.concat([t.toString()])},this.treedux)}createProxy(){return new Proxy(this,{get:(t,e)=>"string"!=typeof e?null:"function"==typeof t[e]?t[e].bind(t):n.create({keyPath:t.keyPath.concat(e)},t.treedux)})}}class u{constructor(t,e){this.keyPath=[],this.treedux=e,this.keyPath=t.keyPath,this.mutators=t.mutators}static create(t,e){return new u(t,e).createProxy()}get(){const t=[...this.keyPath];let e=this.treedux.getState();for(;t.length>0;){const r=t.shift();if(!a.isObject(e)||void 0===e[r])return this.lastKnownValue=void 0,this.lastKnownValue;e=e[r]}return this.lastKnownValue=e,this.lastKnownValue}set(t){return o.create({type:s.SET_BY_KEY_PATH,payload:{keyPath:this.keyPath,value:t}},this.treedux)}subscribe(t){let e=this.lastKnownValue;return this.treedux.subscribe((()=>{const r=this.get();JSON.stringify(r)!==JSON.stringify(e)&&(e=r,t(e))}))}byKey(t){if(!t)throw"Key must be provided to byKey method.";return u.create({keyPath:this.keyPath.concat([t.toString()]),mutators:this.mutators},this.treedux)}delete(){return o.create({type:s.DELETE_BY_KEY_PATH,payload:{keyPath:this.keyPath}},this.treedux)}createReadOnlyCopy(){return n.create({keyPath:this.keyPath},this.treedux)}createProxy(){return new Proxy(this,{get(t,e){if("string"!=typeof e)return null;return t.getMutatorMethod(e)||("function"==typeof t[e]?t[e].bind(t):u.create({keyPath:t.keyPath.concat(e),mutators:t.mutators&&t.mutators[e]?t.mutators[e]:{}},t.treedux))}})}getMutatorMethod(t){if(!this.mutators||!this.mutators.hasOwnProperty(t)||"function"!=typeof this.mutators[t])return null;const e=(0,this.mutators[t])(this.treedux);return e.getAction.bind(e)}}class c{constructor(t,e){this.KEY=t,this.initialState=e.initialState,this.mutators=e.mutators}static create(t,e){return new c(t,e)}get state(){const t={keyPath:[this.KEY],mutators:this.mutators};return u.create(t,this.treedux)}setTreedux(t){return this.treedux=t,this}getInitialState(){return this.initialState}getReducers(){return this.hydrateReducersFromMutators({},this.mutators)}hydrateReducersFromMutators(t,e){for(const r in e){const s=e[r];if("object"==typeof s)this.hydrateReducersFromMutators(t,s);else{const e=s(this.treedux);if(t[e.getType()])throw`Cannot add reducer. Action type already registered: ${r}`;t[e.getType()]=(...t)=>e.reduce.call(e,...t)}}return t}}class h{constructor(t){this.treedux=t}}module.exports=e})();
//# sourceMappingURL=index.cjs.map