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

/**
 * Custom hook to access the GeneralContext.
 * @returns The context value containing the current tab and update function.
 */
export const useGeneralContext = () => useContext(GeneralContext);

/**
 * Provides the GeneralContext details children.
 *
 * @param children The components wrapped by this provider.
 * @returns A context provider component.
 */
const GeneralContextProvider = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<string>("use-cases");

  /**
   * Updates the currently active tab.
   * @param tab The new tab to set as active.
   */
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
