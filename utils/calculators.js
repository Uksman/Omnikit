/**
 * Generates a random password based on provided options.
 */
export const generatePassword = (length, options) => {
  const charset = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
  };

  let characters = "";
  if (options.uppercase) characters += charset.uppercase;
  if (options.lowercase) characters += charset.lowercase;
  if (options.numbers) characters += charset.numbers;
  if (options.symbols) characters += charset.symbols;

  if (!characters) return "";

  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

/**
 * Calculates BMI score and returns classification.
 */
export const calculateBMIScore = (weight, height) => {
  const w = parseFloat(weight);
  const h = parseFloat(height) / 100;

  if (w > 0 && h > 0) {
    const score = w / (h * h);
    let label, color;
    
    if (score < 18.5) { label = "Underweight"; color = "#3B82F6"; }
    else if (score < 25) { label = "Normal"; color = "#10B981"; }
    else if (score < 30) { label = "Overweight"; color = "#F59E0B"; }
    else { label = "Obese"; color = "#EF4444"; }

    return {
      score: score.toFixed(1),
      label,
      color,
    };
  }
  return null;
};

/**
 * Calculates monthly loan payments.
 */
export const calculateMonthlyPayment = (amount, rate, term) => {
  const p = parseFloat(amount);
  const r = parseFloat(rate) / 100 / 12;
  const n = parseFloat(term) * 12;

  if (p > 0 && r > 0 && n > 0) {
    const x = Math.pow(1 + r, n);
    const monthly = (p * x * r) / (x - 1);
    const total = monthly * n;
    const interest = total - p;

    return {
      monthly: monthly.toFixed(2),
      total: total.toFixed(2),
      interest: interest.toFixed(2),
    };
  }
  return { monthly: "0.00", total: "0.00", interest: "0.00" };
};

/**
 * Calculates future value of an investment with compound interest.
 */
export const calculateFutureValue = (principal, contribution, rate, years) => {
  const P = parseFloat(principal) || 0;
  const PMT = parseFloat(contribution) || 0;
  const r = parseFloat(rate) / 100 / 12;
  const n = parseFloat(years) * 12;

  if (r > 0 && n > 0) {
    const x = Math.pow(1 + r, n);
    const FV = P * x + PMT * ((x - 1) / r);
    const totalInvested = P + PMT * n;
    const totalInterest = FV - totalInvested;

    return {
      total: FV.toFixed(2),
      interest: totalInterest.toFixed(2),
      invested: totalInvested.toFixed(2),
    };
  } else if (n > 0) {
    const totalInvested = P + PMT * n;
    return {
      total: totalInvested.toFixed(2),
      interest: "0.00",
      invested: totalInvested.toFixed(2),
    };
  }
  return { total: "0.00", interest: "0.00", invested: "0.00" };
};

/**
 * Calculates discount amount and final price.
 */
export const calculateDiscountInfo = (price, discount, tax) => {
  const p = parseFloat(price) || 0;
  const d = parseFloat(discount) || 0;
  const t = parseFloat(tax) || 0;

  if (p > 0) {
    const discountAmount = p * (d / 100);
    const discountedPrice = p - discountAmount;
    const taxAmount = discountedPrice * (t / 100);
    const finalPrice = discountedPrice + taxAmount;

    return {
      final: finalPrice.toFixed(2),
      saved: discountAmount.toFixed(2),
    };
  }
  return { final: "0.00", saved: "0.00" };
};

/**
 * Handles general unit conversions based on ratios.
 */
export const calculateUnitConversion = (value, fromRatio, toRatio) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "0.00";
  return ((num / fromRatio) * toRatio).toFixed(2);
};

/**
 * Handles temperature conversions.
 */
export const calculateTemperatureConversion = (value, fromUnit, toUnit) => {
  const num = parseFloat(value);
  if (isNaN(num)) return "0.00";
  if (fromUnit === toUnit) return num.toFixed(2);

  let result;
  if (fromUnit === "Celsius") {
    if (toUnit === "Fahrenheit") result = (num * 9) / 5 + 32;
    else if (toUnit === "Kelvin") result = num + 273.15;
  } else if (fromUnit === "Fahrenheit") {
    if (toUnit === "Celsius") result = ((num - 32) * 5) / 9;
    else if (toUnit === "Kelvin") result = ((num - 32) * 5) / 9 + 273.15;
  } else if (fromUnit === "Kelvin") {
    if (toUnit === "Celsius") result = num - 273.15;
    else if (toUnit === "Fahrenheit") result = ((num - 273.15) * 9) / 5 + 32;
  }
  return result ? result.toFixed(2) : "0.00";
};

/**
 * Calculates tip amount, total bill, and per person split.
 */
export const calculateTipValues = (bill, tipPercent, people) => {
  const billNum = parseFloat(bill) || 0;
  const peopleNum = Math.max(1, parseInt(people) || 1);
  const tipAmount = billNum * (tipPercent / 100);
  const totalBill = billNum + tipAmount;
  const perPerson = totalBill / peopleNum;

  return { tipAmount, totalBill, perPerson };
};
