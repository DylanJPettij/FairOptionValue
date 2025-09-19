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

export const HeaderSettings = "font-bold";

export const CellSettings = "font-medium text-gray-900 p-4";
