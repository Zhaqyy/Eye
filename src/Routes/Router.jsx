import React, {useState} from "react";
import { Routes, Route } from "react-router-dom";

import Transitioner from "../Component/Transition";

import Home from "../Pages/Home";
import Scene from "../Scene/Scene";

import Work from "../Pages/Work";
import About from "../Pages/About";

const Router = () => {
  return (
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
        path='/Work/:id'
        element={
          <Transitioner>
            <Work />
          </Transitioner>
        }
      />
    </Routes>
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
