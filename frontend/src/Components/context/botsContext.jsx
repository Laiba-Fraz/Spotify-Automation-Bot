import React, { createContext } from "react";

export const BotsData = createContext({ getData: () => {} });

export function BotsDataProvider(props) {
  function getData(id) {
    console.log("abdullah");
    return "noor";
  }

  return (
    <BotsData.Provider value={{ getData: getData }}>
      {props.children}
    </BotsData.Provider>
  );
}
