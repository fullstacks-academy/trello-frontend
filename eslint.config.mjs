import { defineConfig } from "@fullstacksjs/eslint-config";

export default defineConfig({
  typescript: {
    projectService: {
      allowDefaultProject: ["vitest.setup.ts"],
    },
  },
  rules: {
    "vitest/require-top-level-describe": "off",
  },
});
