import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const dataContext = createContext();

export function DataProvider({ children }) {
  const [update, setUpdate] = useState();
  const [docs, setDocs] = useState();

  useEffect(() => {
    axios
      .get("/api/transactions")
      .then(({ data: { docs } }) => {
        setDocs(docs);
      })
      .catch(console.log);
  }, [update]);

  return (
    <dataContext.Provider value={{ docs, setUpdate }}>
      {children}
    </dataContext.Provider>
  );
}
export function useData() {
  const context = useContext(dataContext);
  return context;
}
