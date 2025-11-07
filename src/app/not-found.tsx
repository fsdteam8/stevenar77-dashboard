import React from "react";
import Link from "next/link";

export default function notFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen  text-red-600 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold mb-4 animate-bounce">404</h1>
        <h2 className="text-3xl md:text-4xl font-semibold mb-2">
          Oops! Page not found
        </h2>
        <p className="mb-6 text-lg md:text-xl text-gray-700">
          The page you are looking for might have been removed or is temporarily
          unavailable.
        </p>
        <Link
          href={"/"}
          className="bg-white text-red-600 font-bold px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition border"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
