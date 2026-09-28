import React from 'react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';

const BeforeAfter = ({ beforeImage, afterImage, style }) => {
  return (
    <div style={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', ...style }}>
      <ReactCompareSlider
        itemOne={<ReactCompareSliderImage src={beforeImage} alt="Before Retouching" />}
        itemTwo={<ReactCompareSliderImage src={afterImage} alt="After Retouching" />}
        position={50}
      />
    </div>
  );
};

export default BeforeAfter;
