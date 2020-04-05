# Hub Flow

Hub Flow is a pattern for managing state in React.js applications. It steals the great principles from Flux & Redux (one-way data flow), but leaves out the ceremonious complexity. Hub Flow comes with built in immutability, which means a huge performance boost and an end to accidental state mutation bugs.
Hub Flow is powered by Freezer.js

```
npm install --save hub-flow
```

## Getting Started

_hub.ts_

```typescript
import createHub, { Hub } from "hub-flow";
import { DBUser, Counter } from "models";

// Describe the Shape of your App State
export interface AppState {
  counter: { count: number };
  // Store the server responses on App state
  // And transform the data via the Model (see below)
  // Basically, store serializable stuff on app state so
  // caching works properly
  users: DBUser[];
}

// Setup the default AppState
// Unless you specify, the app state will be loaded
// from cache if possible
const DEFAULT_STATE: AppState = {
  users: [],
  counter: new Counter(),
};

// Create the HUB
let hub = createHub(DEFAULT_STATE);

export default hub;
```

Once you setup a hub, you want to create a `Model` for the various slices/layers of your application state. In the `Model` you can

- create methods that update AppState
- Setup specific listeners so that your component only re-renders when it needs to.
- Transform data / setup computed values
- Setup relationships with other layers of the application (optionally)

_counter.models.ts_

```typescript
import hub from "global/hub";
import { Model } from "hub-flow";

export class Counter extends Model<Counter> {
  constructor() {
    super();
    this.listener = hub.state.counter.getListener();
  }
  get count() {
    return hub.state.counter.count;
  }
  increment() {
    hub.state.counter.set({ count: hub.state.counter.count + 1 });
  }
  decrement() {
    hub.state.counter.set({ count: hub.state.counter.count - 1 });
  }
  reset() {
    hub.state.counter.set({ count: 0 });
  }
}
```

Then use it in a React component by leveraging `useModel`.

```jsx
import React from "react";
import { Counter } from "models";
import { useModel } from "hub-flow";

export function CounterDisplay() {
  console.log("CounterDisplay -> CounterDisplay");
  const counter = useModel(Counter);
  return <div>Counter: {counter.count}</div>;
}

export function CounterButtons() {
  console.log("CounterButtons -> CounterButtons");
  const counter = useModel(Counter);
  return (
    <div>
      <button onClick={counter.reset}>Reset</button>
      <button onClick={counter.decrement}>-1</button>
      <button onClick={counter.increment}>+1</button>
    </div>
  );
}
```

Under the covers, `useModel` hook:

- Wraps your Model's contstructor witha React.useMemo so that you don't get a new instance of your model with each render
- Additional params will be passed to your Model's constructor
- Wires up to the listeners that you defined in your `Model` so that React renders any time that listener receives and `update` event.

```typescript
useModel(Counter) => new Counter();
// Additional params will be passed to your Model's constructor
useModel(User, 3) => new User(3);
```
