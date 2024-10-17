import React from 'react';

// Define the type of value expected for validation
function Validate(value: string): boolean {
  // Check if the value contains only numeric characters
  const isNumeric = /^\d+$/.test(value);
  return isNumeric;
}

export { Validate };
