import "./App.css";
import { navigation } from "./Routes/navigate";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AuthContextProvider from "./Providers/AuthContextProvider";
// ese ultimo import hacia que el login no apareciera, lo agregue y quedó
import React from "react";
import LoadingIndicator from "./Components/LoadingIndicator";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          {navigation.map(({ id, path, Element }) => (
            <Route
              key={id}
              path={path}
              element={
                <>
                  <Navbar />
                  <React.Suspense fallback={<LoadingIndicator />}>
                    <div style={{ minHeight: "calc(100vh - 164px - 2rem)" }}>
                      <Element />
                    </div>
                  </React.Suspense>
                  <Footer />
                </>
              }
            />
          ))}
          <Route />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
