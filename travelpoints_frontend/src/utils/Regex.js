export const validCoordinates = new RegExp(
    /^([-+]?([0-8]?\d(\.\d{1,7})?|90(\.0{1,7})?))(\s*,\s*)([-+]?((1[0-7]\d|[0-9]?\d)(\.\d{1,7})?|180(\.0{1,7})?))$/
  );