import React from "react";

const NotFound = () => {
  return (
    <div className="flex justify-center flex-col items-center mt-20">
      <h1 className="font-bold text-6xl text-red-500">404 - Not Found</h1>
      <p className="mt-10 text-3xl">
        Sorry, the page you are looking for does not exist.
      </p>
    </div>
  );
};

export default NotFound;
