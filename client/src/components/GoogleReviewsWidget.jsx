import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import './GoogleReviewsWidget.css';

const GoogleReviewsWidget = ({ placeId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this hits a secure backend endpoint that proxies the Google Places API
    // so we don't expose the API key on the frontend.
    // For now, we mock the response to demonstrate the UI.
    setTimeout(() => {
      setReviews([
        { author_name: "Ramesh Naidu", rating: 5, text: "Excellent photo editing and fast delivery for my sister's wedding albums. Best in Vijayawada!", profile_photo_url: "https://ui-avatars.com/api/?name=Ramesh+Naidu&background=random", relative_time_description: "2 weeks ago" },
        { author_name: "Swathi Reddy", rating: 5, text: "The cinematic video editing was beyond our expectations. They really understand Telugu wedding traditions.", profile_photo_url: "https://ui-avatars.com/api/?name=Swathi+Reddy&background=random", relative_time_description: "1 month ago" },
        { author_name: "Kiran Kumar Studios", rating: 5, text: "As a B2B partner, WeddingAlbums.in has been our backbone for all post-production work. Highly reliable.", profile_photo_url: "https://ui-avatars.com/api/?name=Kiran+Kumar&background=random", relative_time_description: "3 months ago" }
      ]);
      setLoading(false);
    }, 1500);
  }, [placeId]);

  if (loading) return <div className="reviews-loader">Loading live reviews...</div>;

  return (
    <div className="google-reviews-container">
      <div className="reviews-header">
        <img src="/images/google-g.svg" alt="Google" width="30" />
        <div>
          <h3>Excellent</h3>
          <div className="stars">
            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#FBBC05" color="#FBBC05" />)}
          </div>
          <p>Based on <strong>150+ reviews</strong></p>
        </div>
      </div>
      
      <div className="reviews-grid">
        {reviews.map((review, idx) => (
          <div key={idx} className="review-card glass-3d">
            <div className="review-author">
              <img src={review.profile_photo_url} alt={review.author_name} />
              <div>
                <h4>{review.author_name}</h4>
                <span>{review.relative_time_description}</span>
              </div>
            </div>
            <div className="review-stars">
              {[...Array(review.rating)].map((_, i) => <Star key={i} size={14} fill="#FBBC05" color="#FBBC05" />)}
            </div>
            <p className="review-text">"{review.text}"</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GoogleReviewsWidget;
