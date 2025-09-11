"use client";

import React from "react";
import { Clock, MapPin,  Star } from "lucide-react";
import Image from "next/image";

type CourseCardProps = {
  location?: string;
  image: string;
  title: string;
  description: string;
  rating: number;
  reviews: number;
  duration: string;
  maxDepth: string;
  features: string[];
  price: string;
  ageRestriction?: string;
  onSeeMore?: () => void;
  onBookNow?: () => void;
};

const CourseCard: React.FC<CourseCardProps> = ({
  image = "/images/rescue-image.png",
  title = "Rescue Dive",
  description = "Your first underwater adventure! Try scuba diving in a controlled pool environment with a certified instructor.",
  rating = 4.8,
  reviews = 32,
  duration = "4 days",
  maxDepth = "Max 40 feet",
  features = [
    "Pool training session",
    "Basic equipment included", 
    "Professional instruction",
    "Certificate of participation"
  ],
  price = "450",
  ageRestriction = "Age 12+",
 
}) => {
  return (
    <section className="max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Course Image */}
        <div className="relative h-48 w-full">
          <Image
            src={image}
            alt={title}
            height={150}
            width={150}
            className=" object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title and Rating */}
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">{rating} ({reviews} reviews)</span>
            </div>
          </div>

          {/* Course Details */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{maxDepth}</span>
            </div>
            <span>{ageRestriction}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
            {description}
          </p>

          {/* Course Includes */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Course Includes:</h3>
            <ul className="space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-teal-600 rounded-full flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">$ {price}</span>
          </div>

          {/* Action Buttons */}
          {/* <div className="flex gap-3">
            <button
              className="flex-1 py-3 px-4 border border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors"
              onClick={onSeeMore}
            >
              See More
            </button>
            <button
              className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors"
              onClick={onBookNow}
            >
              Book Now
            </button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default CourseCard;