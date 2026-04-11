export const CONVERSION_DATA = {
  length: {
    base: "Meters",
    units: {
      "Meters": 1,
      "Feet": 3.28084,
      "Inches": 39.3701,
      "Kilometers": 0.001,
      "Miles": 0.000621371,
      "Centimeters": 100,
      "Millimeters": 1000,
      "Yards": 1.09361,
    }
  },
  weight: {
    base: "KG",
    units: {
      "KG": 1,
      "Pounds": 2.20462,
      "Ounces": 35.274,
      "Grams": 1000,
      "Milligrams": 1000000,
      "Metric Tons": 0.001,
      "Stones": 0.157473,
    }
  },
  temperature: {
    base: "Celsius",
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    isTemp: true
  },
  currency: {
    base: "USD",
    units: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "BRL", "ZAR"],
    isCurrency: true
  }
};
