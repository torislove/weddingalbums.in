import React from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../ScrollReveal';

const SimpleCTA = (props) => {
  const {
    title = "Experience the Difference",
    subtitle = "See why hundreds of couples trust our 20-member team for their big day.",
    btnText = "View Our Work",
    btnLink = "/portfolio"
  } = props;

  return (
    <div className="about-cta container text-center pt-0 pb-6 mt-5">
      <ScrollReveal>
        <h2 className="font-serif mb-4 text-gradient">{title}</h2>
        <p className="mb-4 text-muted">{subtitle}</p>
        <Link to={btnLink} className="btn btn-primary btn-glow">{btnText}</Link>
      </ScrollReveal>
    </div>
  );
};

export default SimpleCTA;
