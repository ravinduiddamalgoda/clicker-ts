import React from 'react';

// Define the type of value expected for validation
function Validate(value: string): boolean {
  // Check if the value contains only numeric characters
  const isNumeric = /^\d+$/.test(value);
  return isNumeric;
};

function  NumberWithCommas( number: number ) : string {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export {Validate, NumberWithCommas};

 