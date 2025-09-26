import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import CourseCard from '../Card/CourseCard'

type CourseModalProps = {
  triggerText?: string;
  courseData?: {
    image: string;
    title: string;
    description: string;
    rating: number;
    reviews: number;
    duration: string;
    maxDepth: string;
    ageRestriction: string;
    features: string[];
    price: string;
    location?: string;
  };
};

const CourseModal: React.FC<CourseModalProps> = ({ 
  triggerText = "View Course",
  courseData = {
    image: "/api/placeholder/400/240",
    title: "Rescue Dive",
    description: "Your first underwater adventure! Try scuba diving in a controlled pool environment with a certified instructor.",
    rating: 4.8,
    reviews: 32,
    duration: "4 days",
    maxDepth: "Max 40 feet",
    ageRestriction: "Age 12+",
    features: [
      "Pool training session",
      "Basic equipment included",
      "Professional instruction",
      "Certificate of participation"
    ],
    price: "450",
    location: "Dive Center"
  }
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSeeMore = () => {
    // console.log('See more
    //  clicked in modal');
    // Add your logic here
  };

  const handleBookNow = () => {
    // console.log('Book now clicked in modal');
    // Add your booking logic here
    // You might want to close the modal after booking
    // setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-teal-600 text-white hover:bg-teal-700">
          {triggerText}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            Course Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          <CourseCard
            image={courseData.image}
            title={courseData.title}
            description={courseData.description}
            rating={courseData.rating}
            reviews={courseData.reviews}
            duration={courseData.duration}
            maxDepth={courseData.maxDepth}
            ageRestriction={courseData.ageRestriction}
            features={courseData.features}
            price={courseData.price}
            location={courseData.location}
            onSeeMore={handleSeeMore}
            onBookNow={handleBookNow}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CourseModal

// Usage example in another component:
// 
// import CourseModal from './CourseModal'
// 
// const SomeComponent = () => {
//   return (
//     <div>
//       <CourseModal triggerText="View Rescue Dive Course" />
//       
//       {/* Or with custom course data */}
//       <CourseModal 
//         triggerText="View Custom Course"
//         courseData={{
//           image: "/custom-image.jpg",
//           title: "Advanced Diving",
//           description: "Advanced underwater course...",
//           rating: 4.9,
//           reviews: 45,
//           duration: "7 days",
//           maxDepth: "Max 100 feet",
//           ageRestriction: "Age 18+",
//           features: ["Advanced techniques", "Deep water training"],
//           price: "750"
//         }}
//       />
//     </div>
//   )
// }