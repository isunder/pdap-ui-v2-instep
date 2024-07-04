import React, { useMemo, useState } from "react";

export const AppContext = React.createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState({
    top: false,
  });
  const AppProviderValue = useMemo(
    () => ({ state, setState }),
    [state, setState]
  );

  return (
    <AppContext.Provider value={AppProviderValue}>
      {children}
    </AppContext.Provider>
  );
};
