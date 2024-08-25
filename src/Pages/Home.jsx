import React from "react";

function Home() {
  return (
    <section className='hero'>
      <div className='main-hero'>
        <nav className='nav'>
          <ul>
            <li className='nav-item'>
              <a href='#'>Overview</a>
            </li>
            <li className='nav-item'>
              <a href='#'>About</a>
            </li>
            <li className='nav-item'>
              <a href='#'>Lab</a>
            </li>
          </ul>
        </nav>
        {/* <div className=''></div> */}
        <div className='detail'>
          <div className='name'>
            <h1>Shuaib Abdulrazaq</h1>
            <h2>Creative Developer</h2>
          </div>
          <div className='project'>
            <h3>Project List</h3>
            <ul>
              <li>
                <a href='#'>Cobuyr</a>
              </li>
              <li>
                <a href='#'>Maleo</a>
              </li>
              <li>
                <a href='#'>Grumbs</a>
              </li>
              <li>
                <a href='#'>Portfolio</a>
              </li>
            </ul>
          </div>
          <h5>Available for Work/Freelance</h5>
        </div>
      </div>
      <div className='hero-footer'>
        <span className='sound'>S</span>
        <ul className='contact'>
          <li>
            <a href='#'>LinkedIn</a>
          </li>
          <li>
            <a href='#'>Codepen</a>
          </li>
          <li>
            <a href='#'>Email</a>
          </li>
        </ul>
      </div>
    </section>
  );
}

export default Home;
