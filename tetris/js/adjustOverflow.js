// adjustOverflow.js

// Function to check and adjust overflow
function adjustOverflow(translatedIndices, originalIndices) {
    const originalEndsWith = originalIndices.map(index => index % 10);
    const translatedEndsWith = translatedIndices.map(index => index % 10);
  
    // Check if any index ends with a digit from 6 to 9 and after rotation ends with a digit from 0 to 3
    if (originalEndsWith.some(digit => digit >= 6 && digit <= 9) && translatedEndsWith.some(digit => digit >= 0 && digit <= 3)) {
      while (translatedIndices.some(index => index % 10 >= 0 && index % 10 <= 3)) {
        translatedIndices = translatedIndices.map(index => index - 1);
        currentPosition -= 1; // Adjust the current position accordingly
      }
    }
  
    // Check if any index ends with a digit from 0 to 3 and after rotation ends with a digit from 6 to 9
    if (originalEndsWith.some(digit => digit >= 0 && digit <= 3) && translatedEndsWith.some(digit => digit >= 6 &&  digit <= 9)) {
      while (translatedIndices.some(index => index % 10 >= 6 && index % 10 <= 9)) {
        translatedIndices = translatedIndices.map(index => index + 1);
        currentPosition += 1; // Adjust the current position accordingly
      }
    }
  
    return translatedIndices;
  }