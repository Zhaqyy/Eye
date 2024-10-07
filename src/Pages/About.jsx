import React from "react";
import "../Style/About.css";
import Griddy from "../Scene/Grid";
// import Griddy from "./Scene/Grid";

const About = () => {
  return (
    <div className="abt">
    <section className="abtInfo">
      <div className='abtHeader'>
        <div></div>
        <div>
          <h1>Shuaib Abdulrazaq</h1>
        </div>
      </div>
      <div className='detail'>
        <div>
          <h3>Creative Developer</h3>
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam optio qui voluptas iusto? Obcaecati delectus ipsam, excepturi a ea suscipit autem voluptatum tempore, incidunt et veritatis eius dolor sit minima.</p>
        </div>
        <div>
            <h3>Services</h3>
            <ul>
                <li>Frontend Development</li>
                <li>No or Low-Code website Development</li>
                <li>3d Creative Development</li>
                <li>Web Design, Interaction and Experience Development</li>
            </ul>
        </div>
      </div>
      <div>
        
      </div>
    </section>
    <section className="abtCanvas">
    <Griddy/>
    </section>
    </div>
  );
};

export default About;
