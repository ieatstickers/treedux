
// Define data store interface
import { Treedux } from "../src/Treedux";
import { UserStore } from "./Module/User/UserStore";
import { AdblockStore } from "./Module/Adblock/AdblockStore";
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from "react";
import { StateNode } from "../src/Data/StateNode";
import { RecursiveStateNode } from "../src/Type/RecursiveStateNode";

// Init treedux
const treedux = Treedux.init(
  {
    [UserStore.KEY]: UserStore.create(),
    [AdblockStore.KEY]: AdblockStore.create()
  },
  {
    hooks: {
      useState: useState,
      useEffect: useEffect,
    }
  }
);

type State<S> = {
  [K in keyof S]?: S[K] | RecursiveStateNode<S[K], any>
}

abstract class AbstractComponent<P, S> extends React.Component<P, S>
{
  protected unsubscribers: { [key: string]: () => void } = {};
  
  protected initState(state: State<S>): S
  {
    const newState = state;
    
    for (const key in state)
    {
      const value = state[key];
      
      if (value instanceof StateNode)
      {
        // Subscribe to the state node
        this.unsubscribers[`state_subscriber_${key}`] = value.subscribe((newValue) => {
          this.setState({
            [key]: newValue
          } as S);
        })
        
        // Get the current value
        newState[key] = value.get();
      }
    }
    
    return newState as S;
  }
  
  public componentWillUnmount()
  {
    for (const key in this.unsubscribers)
    {
      this.unsubscribers[key]();
    }
  }
}

interface ExampleComponentProps {}
interface ExampleComponentState {
  adblockStatus: string,
  adblockWhitelist: string[],
  user: {
    name: string,
    email: string
  }
}

class ExampleComponent extends AbstractComponent<ExampleComponentProps, ExampleComponentState>
{
  public constructor(props: ExampleComponentProps)
  {
    super(props);
    
    this.state = this.initState({
      adblockStatus: treedux.state.adblock.status,
      adblockWhitelist: treedux.state.adblock.userSettings.whitelist,
      user: treedux.state.user.user
    })
  }
  
  public render()
  {
    return <div>
      <div>Name: {this.state.user?.name}</div>
      <div>Email: {this.state.user?.email}</div>
      
      <button
        onClick={() => {
          console.log('clicked');
          treedux
            .state
            .user
            .user
            .set({
              name:  'Mr Test',
              email: 'mr.test@test.com'
            })
            .dispatch();
        }}
      >
        Click to Set User
      </button>
      
      <button
        onClick={() => {
          console.log('clicked');
          treedux
            .state
            .adblock
            .userSettings
            .whitelist
            .add(`test-${Date.now()}.com`)
            .dispatch();
        }}
      >
        Add to Whitelist
      </button>
      
      <div>
        Whitelist:
        
        <ul>
          {
            this.state.adblockWhitelist.map((item, index) => <li key={index}>{item}</li>)
          }
        </ul>
      </div>
    
    </div>
  }
}



function Example() {
  
  const { value: user, set: setUser } = treedux.state.user.user.use();
  const { value: whitelist, add: addToWhitelist } = treedux.state.adblock.userSettings.whitelist.use();
  
  return <div>
    <div>Name: {user?.name}</div>
    <div>Email: {user?.email}</div>
    
    <button
      onClick={() => {
        console.log('clicked');
        setUser({
            name:  'Mr Test',
            email: 'mr.test@test.com'
          })
          .dispatch();
      }}
    >
      Click to Set User
    </button>

    <button
      onClick={() => {
        console.log('clicked');
        addToWhitelist(`test-${Date.now()}.com`).dispatch();
      }}
    >
      Add to Whitelist
    </button>
    
    <div>
      Whitelist:
      
      <ul>
        {
          whitelist.map((item, index) => <li key={index}>{item}</li>)
        }
      </ul>
    </div>
    
  </div>
}

const root = createRoot(document.getElementById('root'));

root.render(<ExampleComponent />);
