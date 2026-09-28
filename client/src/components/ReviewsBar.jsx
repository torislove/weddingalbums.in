import React from 'react';
import { Star, ArrowRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import './ReviewsBar.css';

const REVIEWS = [
  { text: "Best wedding editors in AP! The color grading on our video was cinematic.", author: "Rahul V." },
  { text: "Our Karizma album design is stunning. Worth every single rupee.", author: "Sneha P." },
  { text: "They made the flex design for my Half Saree ceremony look so grand. Highly recommended.", author: "Ananya K." }
];

const ReviewsBar = () => {
  return (
    <section className="reviews-bar-section">
      <div className="container">
        <ScrollReveal className="reviews-bar-grid">
          
          <div className="reviews-score">
            <div className="google-badge">
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" width="24" height="24" />
              <span>Reviews</span>
            </div>
            <div className="score-number">4.9</div>
            <div className="stars">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} size={18} fill="#FFC107" color="#FFC107" />)}
            </div>
            <p className="review-count">Based on 120+ reviews</p>
          </div>

          <div className="reviews-snippets">
            {REVIEWS.map((review, i) => (
              <div key={i} className="review-snippet glass-3d">
                <p>"{review.text}"</p>
                <span>- {review.author}</span>
              </div>
            ))}
          </div>

          <div className="reviews-cta">
            <a href="https://google.com" target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              View All Reviews <ArrowRight size={16} />
            </a>
          </div>

        </ScrollReveal>
      </div>
    </section>
  );
};

export default ReviewsBar;
