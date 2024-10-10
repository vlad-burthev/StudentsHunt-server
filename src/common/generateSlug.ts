import * as uuid from 'uuid';

export const generateSlug = (name: string) => {
  const uniqueId = uuid.v4();
  return name.toLowerCase().replace(/ /g, '_') + '_' + uniqueId;
};
