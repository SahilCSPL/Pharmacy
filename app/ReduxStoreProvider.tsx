"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { ReactNode } from "react";
import { persistor } from "@/redux/store";
import { PersistGate } from "redux-persist/integration/react";

interface AppProps {
  children: ReactNode;
}

const ReduxStoreProvider: React.FC<AppProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default ReduxStoreProvider;
