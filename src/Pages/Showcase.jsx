import React from "react";
import Piano from "../Scene/Showcase/Piano";
import Ribbons from "../Scene/Showcase/Ribbons";

const Showcase = () => {
  return (
    <div id='show' style={{ width: "100%", height: "100vh", touchAction: "none" }}>
      {/* <Piano /> */}
      <Ribbons/>
    </div>
  );
};

export default Showcase;
