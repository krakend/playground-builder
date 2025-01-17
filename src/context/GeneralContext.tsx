import { createContext, useContext, useState } from "react";

interface initialStateType {
  currentTab: string;
  updateCurrentTabHandler: (tab: string) => void;
}

const initialState: initialStateType = {
  currentTab: "use-cases",
  updateCurrentTabHandler: () => {},
};

const GeneralContext = createContext(initialState);

export const useGeneralContext = () => useContext(GeneralContext);

const GeneralContextProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<string>("use-cases");

  const updateCurrentTabHandler = (tab: string) => {
    setCurrentTab(tab);
  };

  return (
    <GeneralContext.Provider value={{ currentTab, updateCurrentTabHandler }}>
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
