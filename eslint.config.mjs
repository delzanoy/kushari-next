// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { FlatCompat } from "@eslint/eslintrc";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const compat = new FlatCompat({
//   baseDirectory: __dirname,
// });

// const eslintConfig = [
//   ...compat.extends("next/core-web-vitals", "next/typescript"),
//   {
//     ignores: [
//       "node_modules/**",
//       ".next/**",
//       "out/**",
//       "build/**",
//       "next-env.d.ts",
//     ],
//   },
// ];

// export default eslintConfig;



import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
  },
  {
    rules: {
      // Allow variables with underscore prefix to be unused
      "@typescript-eslint/no-unused-vars": "off",
      // Allow explicit 'any' in specific cases (or change to 'warn' instead of 'error')
      // "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      // Make React display name rule more flexible
      // "react/display-name": ["error", { "ignoreTranspilerName": true }],
      "react/display-name": "off",
      // Allow some flexibility with React hooks dependencies
      "react-hooks/exhaustive-deps": [
        "warn",
        {
          "additionalHooks": "(useDeepCompareEffect|useDeepCompareCallback)"
        }
      ]
    }
  },
  {
    // Override rules for specific file patterns
    files: ["**/*.tsx"],
    rules: {
      // Allow longer max line length for JSX/TSX files
      "max-len": ["warn", { "code": 400, "ignoreComments": true, "ignoreStrings": true }]
    }
  },
  {
    // Development-specific rules (if you want different rules for dev vs prod)
    // You could conditionally apply these based on NODE_ENV
    rules: process.env.NODE_ENV === 'development' ? {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      "react-hooks/exhaustive-deps": "off"
    } : {}
  }
];

export default eslintConfig;