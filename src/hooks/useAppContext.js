import { useContext } from "react";
import { AppContext } from "../contexts";

export default function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a AppProvider");
  }
  return context;
}
