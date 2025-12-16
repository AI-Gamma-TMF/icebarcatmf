import React, { useState } from "react";
import { SketchPicker } from "react-color";

function ColorPickerForm() {
  // Create a state variable to store the selected color
  const [selectedColor, setSelectedColor] = useState("#ffffff"); // Initialize with a default color

  // Handler function to update the selected color
  const handleColorChange = (color) => {
    setSelectedColor(color.hex);
  };
  return (
    <div>
      <h1>Color Picker Form</h1>
      {/* Display the color picker */}
      <SketchPicker color={selectedColor} onChange={handleColorChange} />
      {/* Render the selected color */}
      <div
        style={{
          backgroundColor: selectedColor,
          width: "50px",
          height: "50px",
        }}
      ></div>
    </div>
  );
}

export default ColorPickerForm;
