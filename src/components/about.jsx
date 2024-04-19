import React from 'react';

const About = () => {
  return (
    <>
      <div
        style={{
          margin: '5%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <h1>About</h1>
        <p>Recipes was created by Amey, using Spoonacular API and React js. </p>
        <p>
          Go to Github repository:{' '}
          <a
            href="https://github.com/AmeyVijeesh/Recipe-Generator"
            target="_blank"
          >
            click here
          </a>
        </p>
        <p>
          Go to Amey's website:{' '}
          <a href="https://ameyvijeesh.netlify.com" target="_blank">
            click here
          </a>
        </p>
      </div>
    </>
  );
};

export default About;
