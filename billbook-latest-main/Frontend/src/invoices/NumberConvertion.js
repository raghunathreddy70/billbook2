const numberToWords = (number) => {
  const ones = [
    "Zero",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (number < 10) return ones[number];
  if (number < 20) return teens[number - 10];
  if (number < 100)
    return (
      tens[Math.floor(number / 10)] +
      (number % 10 !== 0 ? " " + ones[number % 10] : "")
    );
  if (number < 1000)
    return (
      ones[Math.floor(number / 100)] +
      " Hundred" +
      (number % 100 !== 0 ? " " + numberToWords(number % 100) : "")
    );
  if (number < 1000000)
    return (
      numberToWords(Math.floor(number / 1000)) +
      " Thousand" +
      (number % 1000 !== 0 ? " " + numberToWords(number % 1000) : "")
    );
  if (number < 1000000000)
    return (
      numberToWords(Math.floor(number / 1000000)) +
      " Million" +
      (number % 1000000 !== 0 ? " " + numberToWords(number % 1000000) : "")
    );
  return (
    numberToWords(Math.floor(number / 1000000000)) +
    " Billion" +
    (number % 1000000000 !== 0 ? " " + numberToWords(number % 1000000000) : "")
  );
};

export default numberToWords;
