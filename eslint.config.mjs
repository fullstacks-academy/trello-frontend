import { defineConfig } from "@fullstacksjs/eslint-config";

export default defineConfig({
  rules: {
    "vitest/prefer-lowercase-title": "off",
    "vitest/require-top-level-describe": "off",
  },
});
