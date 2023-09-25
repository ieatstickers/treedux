# Treedux

Treedux is a lightweight wrapper for Redux providing fully type-hinted state tree traversal out of the box.

#### Features:

- Uses TypeScript generics to provide easy traversal of the full state tree out of the box
- Default methods available on every tree node to get, set and subscribe to changes without writing any boilerplate code or reducers
- Ability to override any node in the state tree to add custom reducers and action creators (known as Mutators)
- Full support for React hooks to further reduce boilerplate when used with functional components

## Rationale

To modify the application state, Redux requires you to write a reducer to perform the update. The vast majority of the reducers we write are incredibly simple and do nothing more than directly set the value of a particular property with a new value. This logic is often duplicated for most of the properties in each data store, with the only difference being the name of the property it's responsible for updating. This leads to a lot of duplicated boilerplate code to do something very simple.

Treedux is designed to be the antidote to this. Out of the box, it allows you to traverse through your application state tree (fully type-hinted using TypeScript generics) and at each tree node get the current value, update the value with a new one or subscribe to changes, all without writing a single reducer. This allows you to get up and running super quickly with minimal code required.


## Installation

Treedux isn't available on npm yet but you can install it directly from GitHub by adding the following to your package.json:

```json
{
  "dependencies": {
    "treedux": "git+https://git@github.com/ieatstickers/treedux.git"
  }
}
```

## Basic Usage

To get started, you'll need to create one or more data stores and initialise Treedux with them.

```typescript
import { Treedux, DataStore, Action } from 'treedux';

// Define the interface for an example data store
interface UserStore
{
  user: {
    name: string,
    age: number
  },
  preferences: Array<"dark_mode" | "show_notifications">
}

// Create the data store, passing in a unique key/name and the initial state
// Notice the generic parameter "UserStore" (this will be used to provide type-hinting)
const userStore = DataStore.create<UserStore>(
  "user",
  {
    initialState: {
      user:        {
        name: "John McClane",
        age:  32
      },
      preferences: [
        "show_notifications"
      ]
    }
  }
);

// Initialise Treedux with your data stores
const treedux = Treedux.init(
  // Data stores
  {
    user: userStore
  },
  // Options
  {
    // initialState: { ... } // You can optionally pass in the initial state of your application here 
  }
);


// You can now traverse your state tree using the state property on the Treedux instance
// Each node on the tree provides methods to get, set and subscribe to changes
const userNode = treedux.state.user.user;

// Get the current value
const value = userNode.get();

console.log('Initial value of user', value); // { name: "John McClane", age: 30 }

// Subscribe to changes
const unsubscribe = userNode.subscribe((updatedUser) => {
  console.log("User updated", updatedUser);
});

// Stop listening for changes by calling the unsubscribe function
// unsubscribe();

// Update the name with a new value
userNode
  .set({
    name: 'Holly Gennero',
    age:  30
  }) // The set method returns an action (calling set alone will not dispatch the action)
  .dispatch(); // The dispatch method will actually dispatch the action to the store and update the state

// If you want to dispatch multiple actions at once, you can pass multiple actions to the dispatch method on the Treedux instance
// Batched actions will only notify subscribers when all actions have been processed by the store
treedux.dispatch(
  userNode.name.set("Holly McClane"),
  userNode.age.set(29)
);

// Every node on the tree provides the same methods to get, set and subscribe to changes
// Therefore you can update just a single property on the user node if you want to
userNode.age.set(28).dispatch();

```

## Adding Custom Reducers & Action Creators

```typescript
import { Treedux, DataStore, Action, AbstractMutator } from "treedux";

// You can also add you own custom reducers and action creators to the store through the use of mutators
// Mutators are classes that extend the AbstractMutator class and are passed to the DataStore.create method
class AddPreferenceMutator extends AbstractMutator<UserStore>
{
  // The action type is required to identify the action in the reducer
  public getType(): string
  {
    return "user/add_preference";
  }
  
  // The getAction method is used to create an action that can be dispatched to the store
  public getAction(...preferences: Array<UserPreferenceEnum>): Action<Array<UserPreferenceEnum>>
  {
    return Action.create(
      {
        type:    this.getType(), // This must match the type returned by the getType method
        payload: preferences
      },
      this.treedux // The treedux instance is required to dispatch the action using .dispatch()
    );
  }
  
  // The reduce method will be automatically registered with the store and called when the action is dispatched
  // You do not need to clone the state or return the updated state - Treedux uses Redux Toolkit under the hood which no longer requires this
  public reduce(state: UserStore, action: { type: string, payload: Array<UserPreferenceEnum> }): void
  {
    state.preferences.push(
      ...action.payload.filter((preference) => !state.preferences.includes(preference))
    );
  }
}

// Your mutators must be passed to the DataStore.create method
// The mutators object must mirror the structure of your data store and each node accepts an object of mutators 
// The key of the object is used as the method name when type-hinting it on the node e.g. "add()" in the example below
const mutators = {
  preferences: {
    add: (treedux: Treedux) => new AddPreferenceMutator(treedux)
  }
};

// Create your data store, passing in a unique key/name and the initial state as we did in the example above
// Notice the second generic parameter "typeof mutators" (this will be used to type-hint the mutators on the relevant node)
const userStore = DataStore.create<UserStore, typeof mutators>(
  "user",
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
    mutators: mutators
  }
);

// Initialise TreeDux with your data stores as we did in the example above
const treedux = Treedux.init(
  {
    user: userStore
  }
);

treedux
  .state
  .user
  .preferences
  .add(UserPreferenceEnum.DARK_MODE) // The add method is now type-hinted for the getAction() method on the mutator
  .dispatch();


```

## React Hooks

Each node in the state tree also has a use() method that uses React hooks internally. This allows you to use Treedux with functional components and further reduces the amount of boilerplate code required. The `set` method and any mutator methods used will update the Redux store, then sync the new Redux value with the internal component state automatically.

The `value` property provides the current value of the node and all other methods that would usually be type-hinted on the node itself are exported e.g. `set` and any other mutator methods you've registered (see preferences example below).

```tsx

function ExampleComponent()
{
  // Each node in the state tree also has a use() method that uses React hooks internally
  const { value: user, set: setUser } = treedux.state.user.user.use();
  const { value: preferences, add: addPreference } = treedux.state.user.preferences.use();
  
  
  return <div>
    <h5>Name: {user?.name}</h5>
    
    <h6>Preferences</h6>
    
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
import { useState, useEffect } from "react";

const treedux = Treedux.init(
  {
    user: ...
  },
  {
    hooks: {
      useState:  useState,
      useEffect: useEffect
    }
  }
);

```
