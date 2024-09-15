import React from "react";
import { useParams } from "react-router-dom";
import { projectData } from "../Component/ProjectData";

const Work = () => {
  const params = useParams();
  const id = params.id;
  const data = projectData.find(work => work.id === parseInt(id));

  if (!data) {
    return <h1>Work not found</h1>; // Handle case when work is not found
  }

  return (
    <div>
      <h1>{data?.title}</h1>
    </div>
  );
};

export default Work;
