
// Define data store interface
import { Treedux } from "../src/Treedux";
import { UserStore } from "./Module/User/UserStore";
import { AdblockStore } from "./Module/Adblock/AdblockStore";
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from "react";

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

root.render(<Example />);
