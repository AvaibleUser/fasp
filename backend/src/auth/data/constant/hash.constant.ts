import { genSaltSync } from 'bcrypt';

export const hashConfig = {
  salt: genSaltSync(),
};
