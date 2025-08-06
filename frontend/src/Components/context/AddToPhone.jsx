import React, { createContext, useState } from "react";

export const AddToPhoneOverlay = createContext({
  overlayState: true,
  showOverlay: () => {},
  hideOverlay: () => {},
});

export function AddToPhoneOverlayProvider(props) {
  const [showOverlayState, setOverlayState] = useState(false);

  const showOverlay = () => {
    setOverlayState(true);
  };

  const hideOverlay = () => {
    setOverlayState(false);
  };

  return (
    <AddToPhoneOverlay.Provider
      value={{
        overlayState: showOverlayState,
        showOverlay: showOverlay,
        hideOverlay: hideOverlay,
      }}
    >
      {props.children}
    </AddToPhoneOverlay.Provider>
  );
}
