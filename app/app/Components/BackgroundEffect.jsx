"use client";
import React from "react";
import PropTypes from "prop-types";

const BackgroundGradient = ({
  className = "",
  width = "w-32",
  height = "h-32",
  blur = "blur-2xl",
  gradientDirection = "bg-gradient-to-br",
  fromColor = "from-purple-500/30",
  toColor = "to-blue-500/30",
}) => {
  // Combine the classes together.
  const combinedClasses = `${gradientDirection} ${fromColor} ${toColor} ${blur} ${width} ${height} ${className}`;
  return <div className={combinedClasses}></div>;
};

ReusableGradient.propTypes = {
  className: PropTypes.string,
  width: PropTypes.string,
  height: PropTypes.string,
  blur: PropTypes.string,
  gradientDirection: PropTypes.string,
  fromColor: PropTypes.string,
  toColor: PropTypes.string,
};

export default React.memo(BackgroundGradient);
