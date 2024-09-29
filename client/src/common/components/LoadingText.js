import React, { useEffect, useState } from "react";

const LoadingDots = ({ text, circle }) => {
  const [dots, setDots] = useState(circle ? "•" : ".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prevDots =>
        prevDots.length >= 3
          ? circle
            ? "•"
            : "."
          : prevDots + (circle ? "•" : ".")
      );
    }, 400);

    return () => {
      clearInterval(interval);
    };
  }, []); // eslint-disable-line

  return (
    <span style={{ display: "inline-flex", alignItems: "baseline" }}>
      {text}
      {dots}
    </span>
  );
};

export default LoadingDots;
