const chartColorsFromRgb = (r, g, b) => {
  return {
    backgroundColor: `rgba(${r},${g},${b},0.4)`,
    borderColor: `rgba(${r},${g},${b},1)`,
    pointBorderColor: `rgba(${r},${g},${b},1)`,
    pointHoverBackgroundColor: `rgba(${r},${g},${b},1)`,
    pointHoverBorderColor: "rgba(220,220,220,1)"
  };
};

export const colors = [
  chartColorsFromRgb(62, 149, 205),
  chartColorsFromRgb(142, 94, 162),
  chartColorsFromRgb(60, 186, 159),
  chartColorsFromRgb(232, 195, 185),
  chartColorsFromRgb(196, 88, 80)
];

const lightBlue = "#d9eeec";
const blue = "#64b2cd";
const darkBlue = "#3c70a4";
