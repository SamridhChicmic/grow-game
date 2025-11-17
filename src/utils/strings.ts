export function lettersAndNumbersOnly(
  inputString: string,
  options?: { exception: string },
) {
  const regexPattern = new RegExp(
    `[^a-zA-Z0-9${options ? options.exception : ""}]`,
    "g",
  );

  // Remove non-alphanumeric characters
  // const formattedString = inputString.replace(/[^a-zA-Z0-9]/g, "");
  const formattedString = inputString.replace(regexPattern, "");
  return formattedString;
}

export function formatToNumberWithDecimal(inputString: string) {
  // Remove non-alphanumeric characters
  const formattedString = inputString.replace(/[^\d.]/g, "");
  return formattedString;
}

export function capitalizeCamelCase(input: string): string {
  return input
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (match) => match.toUpperCase());
}

export function formatToSnakeCase(inputString: string): string {
  return inputString.replace(/([a-z\d])([A-Z])/g, "$1_$2").toLowerCase();
}

export function formatLeaderboardTime(dateString: string) {
  const originalDate = new Date(dateString);

  const hours = String(originalDate.getUTCHours()).padStart(2, "0");
  const minutes = String(originalDate.getUTCMinutes()).padStart(2, "0");
  const seconds = String(originalDate.getUTCSeconds()).padStart(2, "0");
  const formattedTime = `${hours}:${minutes}:${seconds}`;
  return formattedTime;
}

type FormatOption =
  | "default"
  | "capitalizeFirst"
  | "capitalizeEach"
  | "uppercase";

export const camelCaseToText = (
  input: string,
  format: FormatOption = "default",
): string => {
  // Split the camelCase string by finding where uppercase letters are and adding a space before them
  const result = input
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .trim();

  switch (format) {
    case "capitalizeFirst":
      return result.charAt(0).toUpperCase() + result.slice(1);
    case "capitalizeEach":
      return result.replace(/\b\w/g, (char) => char.toUpperCase());
    case "uppercase":
      return result.toUpperCase();
    default:
      return result;
  }
};
