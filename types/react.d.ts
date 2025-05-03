// Add missing type definitions for React 19.1.0
import 'react';

declare module 'react' {
  /* eslint-disable */
  export function useActionState<State, Payload, Return>(
    action: (payload: Payload) => Return,
    initialState: State
  ): [State, (payload: Payload) => void, boolean];
  /* eslint-enable */
}
