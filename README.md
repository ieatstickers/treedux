# Treedux

### Introduction

To modify the application state in any way, Redux requires you to write a reducer to perform the change. The vast majority of the reducers we write are incredibly simple and do nothing other than directly set the value of a particular property with a new value. This logic is often duplicated for most properties in each data store, with the only difference being the name of the property its updating. This leads to a lot of duplicated boilerplate code to do something that is super simple.

Treedux is designed to be the antidote to this. Out of the box, it allows you to traverse through your application state tree (fully type-hinted) and at each tree node get the current value, update the value with a new one or subscribe to changes, all without writing a single reducer. This allows you to get up and running super quickly with minimal code required.

### Goals

#### 1. Application State Tree Traversal

Out of the box, Treedux should provide a fully type-hinted way to traverse through the application state tree. Each node in the tree should provide methods out of the box to get the current value, set a new value, subscribe to changes and access hooks that can be used in React components.

#### 2. Override Tree Nodes

Although the default behaviour will cover the majority of use cases, there will be occasions where `get`, `set` and `subscribe` are not enough. An example of this might be a list of whitelisted pages for ad blocker. Using `get` and `set` alone could lead to race conditions if used in multiple places in the application and therefore should be replaced with `add`, `remove` and `clear` methods. To do this we'll need the ability to override the default node in the state tree that provides the new methods, removes the ones we no longer want to expose and register any custom reducers that will be required so Redux knows how to handle these new actions.

#### 3. Add Ghost/Virtual Nodes

For ultimate flexibility, the type-hinted application state tree should provide the ability to add "ghost" or "virtual" nodes which don't directly map to a property in the state tree. You might want to group several bits of data together and get, set and subscribe to them as if it was a node in its own right.
