export const getNameFromEgrpou = (name: string) => {
  const nameToArray = name.split('"');
  if (nameToArray.length > 1) {
    return nameToArray[1].replace(/[^a-zA-Zа-яА-ЯёЁ\s]/g, '');
  }
  return nameToArray[0];
};
