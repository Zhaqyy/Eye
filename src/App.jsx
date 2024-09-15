import React, { useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Scene from "./Scene/Scene";
import Work from "./Pages/Work";

const App = () => {
  return (
    <>
      <Routes>
        <Route index exact path='/' element={<Main />} />
        <Route path='/Work/:id' element={<Work />} />
      </Routes>
    </>
  );
};

export default App;

const Main = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <Scene activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
      <Home activeIndex={activeIndex} setActiveIndex={setActiveIndex} />
    </>
  );
};
