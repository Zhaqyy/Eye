import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Loader from "../Component/Loader/Loader";
import Transitioner from "../Component/Transition";

import Home from "../Pages/Home";
import Scene from "../Scene/Scene";

import Work from "../Pages/Work";
import About from "../Pages/About";

import Showcase from "../Pages/Showcase";
import Header from "../Component/Header";

const Router = () => {
  const [loaderFinished, setLoaderFinished] = useState(false);

  return (
    <>
      <Loader onComplete={() => setLoaderFinished(true)} />

      {/* Render routes only after the loader signals completion */}
      {loaderFinished && (
        <>
          <Header />

          <Routes>
            <Route
              index
              path='/'
              element={
                <Transitioner>
                  <Main />
                </Transitioner>
              }
            />
            <Route
              path='/about'
              element={
                <Transitioner>
                  <About />
                </Transitioner>
              }
            />
            <Route
              path='/Project/:id'
              element={
                <Transitioner>
                  <Work />
                </Transitioner>
              }
            />
          </Routes>
        </>
      )}
      {/* <Routes>
        <Route
          path='/show'
          element={
            <Transitioner>
              <Showcase />
            </Transitioner>
          }
        />
      </Routes> */}
    </>
  );
};

export default Router;

const Main = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <Home activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </>
  );
};
