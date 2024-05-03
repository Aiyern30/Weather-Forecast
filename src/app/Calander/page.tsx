import React from "react";

const page = () => {
  return (
    <div>
      <div className="relative h-48 w-48">
        <div className="overflow-hidden absolute inset-0 rounded-full bg-gray-200">
          <div className="absolute top-0 left-0 h-full w-1/2"></div>
          <div className="absolute top-0 left-0 h-full bg-gray-300 w-1/2"></div>
        </div>
        <div className="flex justify-center items-center absolute inset-0">
          <span className="text-4xl font-bold text-gray-800">50%</span>
        </div>
      </div>
      <div>
        <div className="relative h-48 w-48">
          <div className="overflow-hidden absolute inset-0 rounded-full bg-gray-200">
            <div className="absolute top-0 left-0 h-1/2 w-full bg-gray-300"></div>
            <div className="absolute bottom-0 left-0 h-1/2 w-full"></div>
          </div>
          <div className="flex justify-center items-center absolute inset-0">
            <span className="text-4xl font-bold text-gray-800">50%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
