import React, { createContext, useReducer } from "react";

function AuthReducer(state, action) {
  switch (action.type) {
    case "login":
      return { user: action.payload.id, email: action.payload.email };
    case "logout":
      return { user: null, email: null };
    default:
      return state;
  }
}

export const AuthContext = createContext({ data: null, dispatch: () => {} });

export function AuthContextProvider(props) {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
    email: null,
  });

  return (
    <AuthContext.Provider value={{ data: state, dispatch: dispatch }}>
      {props.children}
    </AuthContext.Provider>
  );
}
