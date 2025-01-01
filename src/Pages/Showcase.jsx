import React from "react";
import Piano from "../Scene/Showcase/Piano";
import Ribbons from "../Scene/Showcase/Ribbons";
import ContactCard from "../Scene/Showcase/ContactCard";
import InfinityWall from "../Scene/Showcase/InfinityWall";
import SocialCard from "../Scene/Showcase/SocialCard";
import Smiley from "../Scene/Showcase/Smiley";

const Showcase = () => {
  return (
    <div id='show' style={{ width: "100%", height: "100vh", touchAction: "none", alignContent: 'center' }}>
      {/* <Piano /> */}
      {/* <Ribbons/> */}
      {/* <ContactCard /> */}
      {/* <InfinityWall/> */}
      {/* <SocialCard/> */}
      <Smiley/>
    </div>
  );
};

export default Showcase;
