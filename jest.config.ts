/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  projects: ['<rootDir>/packages/@core', '<rootDir>/packages/nestjs'],
  globals: {
    'ts-jest': {
      isolatedModules: true,
    },
  },
};
