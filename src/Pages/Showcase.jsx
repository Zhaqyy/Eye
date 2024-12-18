import React from "react";
import Piano from "../Scene/Showcase/Piano";
import Ribbons from "../Scene/Showcase/Ribbons";
import ContactCard from "../Scene/Showcase/ContactCard";

const Showcase = () => {
  return (
    <div id='show' style={{ width: "100%", height: "100vh", touchAction: "none", alignContent: 'center' }}>
      {/* <Piano /> */}
      {/* <Ribbons/> */}
      <ContactCard />
    </div>
  );
};

export default Showcase;
