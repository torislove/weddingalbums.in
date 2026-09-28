import React from 'react';
import DynamicPage from '../components/DynamicPage';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <DynamicPage pageId="home" />
    </div>
  );
};

export default Home;
