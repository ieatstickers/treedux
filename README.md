# Treedux

Treedux is a lightweight wrapper for Redux providing fully type-hinted state tree traversal out of the box.

#### Features:

- Uses TypeScript generics to provide easy traversal of the full state tree out of the box
- Default methods available on every tree node to get, set and subscribe to changes without writing any boilerplate code or reducers
- Ability to override any node in the state tree to add custom reducers and action creators (known as Mutators)
- Full support for React hooks to further reduce boilerplate code when used with functional components

## Rationale

To modify the application state, Redux requires you to write a reducer to perform the update. The vast majority of the reducers we write are incredibly simple and do nothing more than directly set the value of a particular property with a new value. This logic is often duplicated for most of the properties in each data store, with the only difference being the name of the property it's responsible for updating. This leads to a lot of duplicated boilerplate code to perform a series of very simple operations.

Treedux is designed to be the antidote to this. Out of the box, it allows you to traverse through your application state tree (fully type-hinted using TypeScript generics) and at each tree node get the current value, update the value with a new one or subscribe to changes, all without writing a single reducer. This allows you to get up and running super quickly with minimal code required.


## Installation

Using npm:

```bash
npm install treeduxjs
```

Using yarn:

```bash
yarn add treeduxjs
```

## Example Usage

### 1. Creating a Data Store

To get started, you'll need to create one or more data stores. Each data store requires a unique key/name, an interface or type describing the shape of the data store's state and the initial state of the data store.

```typescript
// UserStore.ts

import { DataStore } from 'treedux';

export enum UserPreferenceEnum {
  DARK_MODE = "dark_mode",
  SHOW_NOTIFICATIONS = "show_notifications"
}

export interface UserStoreInterface
{
  user: {
    name: string,
    age: number
  },
  preferences: Array<UserPreferenceEnum>
}

export class UserStore
{
  public static KEY: "user" = "user";
  
  public static create()
  {
    return DataStore.create<UserStoreInterface>(
      UserStore.KEY,
      {
        initialState: {
          user: {
            name: "John McClane",
            age:  32
          },
          preferences: [
            UserPreferenceEnum.SHOW_NOTIFICATIONS
          ]
        }
      }
    );
  }
}
```

### 2. Initialising Treedux

```typescript
// index.ts

import { Treedux } from "treeduxjs";
import { UserStore } from "./UserStore";

const treedux = Treedux.init(
  // Data store map
  {
    [UserStore.KEY]: UserStore.create()
  },
  // Options
  {
    // initialState: { ... } // You can optionally pass in the initial state of your application here
  }
);
```

### 3. Using Default Methods

You can now use the `state` property on the Treedux instance to traverse the state tree. Out of the box, each node on the tree provides methods to get, set and subscribe to changes.

```typescript
const userNode = treedux.state.user.user;

// Get the current value
const value = userNode.get();

console.log('Initial value of user', value); // { name: "John McClane", age: 32 }

// Subscribe to changes
const unsubscribe = userNode.subscribe((updatedUser) => {
  console.log('User updated', updatedUser);
});

// Stop listening for changes by calling the unsubscribe function
// unsubscribe();

// Update the name with a new value
userNode
  .set({ name: 'Holly Gennero', age:  30 }) // The set method returns an action (calling set alone will not dispatch the action)
  .dispatch(); // The dispatch method will actually dispatch the action to the store and update the state
```

### 4. Using Dynamic Nodes

For the keys that are explicitly specified in your data store's interface, you can use the type-hinted properties to traverse the tree. However, sometimes parts of the state tree use index signatures or other dynamic keys that can't be explicitly type-hinted. In these cases, you can use the `byKey` and `delete` methods to traverse the tree and delete dynamically created data. These additional methods are only available on nodes that are dynamic and can't be type-hinted in the usual way.

Let's take the following data store interface as an example. It tracks the number of ads and trackers blocked on each domain for each tab in the browser.

```typescript

interface AdblockStats
{
  stats: {
    [tabId: number]: {
      [domain: string]: {
        adsBlocked: number,
        trackersBlocked: number
      }
    }
  }
}
```

As the tabs and domains are both created dynamically and can't be explicitly typed, we'll use the `byKey` method to traverse the tree.

```typescript
// All the usual methods are available as they would be on any other state node
const stateNode = treedux.state.adblock.stats.byKey(123).byKey('example.com');

// We can get the current value
const currentValue = stateNode.get();

// We can subscribe to changes
stateNode.subscribe((stats) => {
  console.log('Stats updated', stats);
})

// And we can set a new value
stateNode.set({
  adsBlocked: 123,
  trackersBlocked: 456
});
```

These dynamic nodes also have access to the `delete` method which completely removes the data from the state tree (rather than setting its value to null or undefined).

```typescript
// Delete the stat for the domain 'example.com' on tabId 123
treedux.state.adblock.stats.byKey(123).byKey('example.com').delete().dispatch();
// Delete all stats for the tab with an id of 123
treedux.state.adblock.stats.byKey(123).delete().dispatch();
```

### 5. Using Mutators

Sometimes, you need to perform more complex updates to the state and the default `set` method isn't enough. This is especially true for data structures like arrays where getting the current value, pushing an item in then setting it again could introduce race conditions. 

In these cases, you can override any node in the state tree and add custom reducers and action creators (known as Mutators). This is done by passing a mutator map to the `create` method on the DataStore class.

Let's create a mutator to add to the user preferences array. The mutator should extend the `AbstractMutator` class and implement the `getType`, `getAction` and `reduce` methods.

The `getType` method must return a unique string. This is used to identify the mutator and find its reducer when the action is dispatched.

The `getAction` method should return an instance of the `Action` class. The type of the action should match the value returned by the `getType` method.

The `reduce` method contains the logic that performs the update to the state. The first parameter is the current state of the data store and the second is the action that is being dispatched.

```typescript
// AddPreferenceMutator.ts

import { AbstractMutator, Action } from "treeduxjs";
import { UserStoreInterface } from "./UserStore";

class AddPreferenceMutator extends AbstractMutator<UserStoreInterface>
{
  public getType(): string
  {
    return "user/add_preference";
  }
  
  public getAction(...preferences: Array<UserPreferenceEnum>): Action<Array<UserPreferenceEnum>>
  {
    return Action.create(
      {
        type: this.getType(), 
        payload: preferences
      },
      this.treedux
    );
  }
  
  public reduce(state: UserStoreInterface, action: { type: string, payload: Array<UserPreferenceEnum> }): void
  {
    state.preferences.push(
      ...action.payload.filter((preference) => !state.preferences.includes(preference))
    );
  }
}
```

Now we can update our `UserStore` to register the mutator when the store is created. 

```typescript
// UserStore.ts

import { DataStore } from 'treedux';
import { AddPreferenceMutator } from './AddPreferenceMutator';

export enum UserPreferenceEnum {
  DARK_MODE = "dark_mode",
  SHOW_NOTIFICATIONS = "show_notifications"
}

export interface UserStoreInterface
{
  user: {
    name: string,
    age: number
  },
  preferences: Array<UserPreferenceEnum>
}

export class UserStore
{
  public static KEY: "user" = "user";
  // The mutators object must mirror the structure of your data store and each node accepts an object 
  // where the key is the method name and the value is a function that takes a Treedux instance as 
  // an argument and returns an instance of the mutator
  private static readonly mutators = {
    preferences: {
      add: (treedux: Treedux) => new AddPreferenceMutator(treedux)
    },
  };
  
  public static create()
  {
    return DataStore.create<UserStoreInterface, typeof this.mutators>( // Notice the second generic parameter "typeof mutators" (this will be used to type-hint the mutators on the relevant node)
      UserStore.KEY,
      {
        initialState: {
          user: {
            name: "John McClane",
            age:  32
          },
          preferences: [
            UserPreferenceEnum.SHOW_NOTIFICATIONS
          ]
        },
        mutators: this.mutators // Your mutators must be passed to the DataStore.create method options under the "mutators" key
      }
    );
  }
}
```

Now we can use the mutator to add a new preference to the array.

```typescript

treedux
  .state
  .user
  .preferences
  .add(UserPreferenceEnum.DARK_MODE) // The add method is now type-hinted for the getAction() method on the mutator
  .dispatch();

```

## 6. Read Only

Sometimes there are instances where you might want to expose state to another part of your application, but you don't want it to be modified. In these cases, you can use the `toReadOnly()` method to create a read-only version of any node. It will include the regular `get()`, `subscribe()` and `byKey()` methods but will not include `set()`, `delete()` or any custom mutator methods. You will also be able to continue to traverse through the state tree after calling `toReadOnly()` but any subsequent nodes will also be read-only. 

```typescript
const readOnlyNode = treedux
  .state
  .user
  .preferences
  .toReadOnly();

const value = readOnlyNode.get();
```
