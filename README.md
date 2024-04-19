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

### 4. Using Mutators

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

### 5. Using React Hooks

Each node on the state tree also provides a React hook through the `use` method that exposes the current value, the `set` method and any mutator methods like the `add` method in the previous example. The hook will automatically unsubscribe when the component unmounts.

```tsx
function ExampleComponent()
{
  const { value: user, set: setUser } = treedux.state.user.user.use();
  const { value: preferences, add: addPreference } = treedux.state.user.preferences.use();
  
  
  return <div>
    <h5>Name: {user?.name}</h5>
    
    <h6>Preferences:</h6>
    
    <ul>
      {preferences.map((preference, index) => <li key={index}>{preference}</li>)}
    </ul>
    
    <button
      onClick={() => addPreference(UserPreferenceEnum.DARK_MODE).dispatch()}
    >
      Enable Dark Mode
    </button>
  </div>;
}

```
In order for the `use` method to work properly, you'll need to give Treedux the `useState` and `useEffect` hooks from the version of React you're using through the options object when initialising Treedux:

```typescript
// index.ts

import { Treedux } from "treeduxjs";
import { UserStore } from "./UserStore";
import { useState, useEffect } from "react";

const treedux = Treedux.init(
  // Data store map
  {
    [UserStore.KEY]: UserStore.create()
  },
  // Options
  {
    // initialState: { ... } // You can optionally pass in the initial state of your application here
    hooks: {
      useState:  useState,
      useEffect: useEffect
    }
  }
);
```
