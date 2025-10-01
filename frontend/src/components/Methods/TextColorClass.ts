export const TextColorClass = (value: number) => {
  let textColor;
  if (value > 0) {
    textColor = "text-green-400";
  }
  if (value < 0) {
    textColor = "text-red-400";
  }
  if (value == 0) {
    textColor = "text-gray-400";
  }
  return textColor;
};
