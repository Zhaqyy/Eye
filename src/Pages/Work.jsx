import React from "react";
import { useParams } from "react-router-dom";
import { projectData } from "../Component/ProjectData";
import "../Style/Work.css";

const Work = () => {
  const params = useParams();
  const id = params.id;
  const data = projectData.find(work => work.id === parseInt(id));

  if (!data) {
    return <h1>Work not found</h1>; // Handle case when any work is not found
  }

  return (
    <div className="work-wrap">
      <section className='work'>
        <div className='title'>
          <h6>
            {data?.client} - {data?.year}
          </h6>
          <h1>{data?.title}</h1>
        </div>
        <div className='detail'>
          <div className='desc'>
            <p>{data?.detail}</p>
            <a href='#'>Live View</a>
          </div>
          <div className='service'>
            <div>
              <h4>Services</h4>
              <ul>
                {data?.role?.map((roleItem, index) => (
                  <li key={index}>
                    <p>{roleItem}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className='stack'>
              <h4>Stack/Tools</h4>
              <ul>
                {data?.stack?.map((stackItem, index) => (
                  <li key={index}>{stackItem}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
      <section className='gallery'>
        <div className='image-slider'>
          {data?.gallery?.map((img, index) => (
            // <div className='image-wrapper' key={index}>
              <img key={index} src={img} alt={`Work image ${index + 1}`} />
            // </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Work;
