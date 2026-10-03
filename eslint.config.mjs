import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Layer boundaries (specs/16-arquitectura-por-capas.md, "Reglas de dependencia").
// In flat config the last block that matches a file replaces the rule options instead
// of merging them, so the `files` globs of these blocks must not overlap.
// presentation/components/ui is left out on purpose: the shadcn CLI writes it.
const TARGETS = {
  app: ["@/app", "@/app/**"],
  domain: ["@/domain", "@/domain/**"],
  data: ["@/data", "@/data/**"],
  presentation: ["@/presentation", "@/presentation/**"],
  hooks: ["@/presentation/hooks", "@/presentation/hooks/**"],
  pages: ["@/presentation/pages", "@/presentation/pages/**"],
  components: ["@/presentation/components", "@/presentation/components/**"],
  molecules: [
    "@/presentation/components/molecules",
    "@/presentation/components/molecules/**",
  ],
  organisms: [
    "@/presentation/components/organisms",
    "@/presentation/components/organisms/**",
  ],
  react: ["react", "react/*", "react-dom", "react-dom/*"],
  next: ["next", "next/*"],
  zustand: ["zustand", "zustand/*"],
};

function layer(dir, forbidden) {
  return {
    files: [`${dir}/**`],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: forbidden.map((target) => ({
            group: TARGETS[target],
            message: `${dir} cannot import ${TARGETS[target][0]} (layer rules in specs/16).`,
          })),
        },
      ],
    },
  };
}

const layerBoundaries = [
  layer("src/domain", ["data", "presentation", "app", "react", "next", "zustand"]),
  layer("src/data", ["presentation", "app", "react"]),
  layer("src/presentation/hooks", ["components", "pages", "app"]),
  layer("src/presentation/pages", ["app"]),
  layer("src/presentation/components/organisms", ["data", "pages", "app"]),
  layer("src/presentation/components/molecules", [
    "data",
    "hooks",
    "organisms",
    "pages",
    "app",
  ]),
  layer("src/presentation/components/atoms", [
    "data",
    "hooks",
    "molecules",
    "organisms",
    "pages",
    "app",
  ]),
  layer("src/app", ["domain", "data"]),
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...layerBoundaries,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Reference-only design handoff bundle, not implementation code.
    "Prototipo-Vapati-Next.js/**",
  ]),
]);

export default eslintConfig;
