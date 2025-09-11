import React from 'react'
import CourseCard from '../Card/CourseCard'

const CourseView = () => {
  const handleSeeMore = () => {
    console.log('See more clicked');
  };

  const handleBookNow = () => {
    console.log('Book now clicked');
  };

  return (
    <div className="p-6">
      <CourseCard
        image="/path/to/your/dive-image.jpg" // Replace with actual image path
        title="Rescue Dive"
        description="Your first underwater adventure! Try scuba diving in a controlled pool environment with a certified instructor."
        rating={4.8}
        reviews={32}
        duration="4 days"
        maxDepth="Max 40 feet"
        ageRestriction="Age 12+"
        features={[
          "Pool training session",
          "Basic equipment included",
          "Professional instruction",
          "Certificate of participation"
        ]}
        price="450"
        location="Dive Center"
        onSeeMore={handleSeeMore}
        onBookNow={handleBookNow}
      />
    </div>
  )
}

export default CourseView