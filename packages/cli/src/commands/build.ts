import { access } from "node:fs/promises";
import { exit } from "node:process";
import { log } from "@clack/prompts";
import { prebuild } from "../prebuild";
import {
  INTERNAL_TEMPLATES,
  LOCAL_DATA_FILE,
  PROJECT_TEMPLATES,
} from "../config";
import type {
  CommonYargsArgv,
  StrictYargsOptionsToInterface,
} from "./yargs-types";

export const buildOptions = (yargs: CommonYargsArgv) =>
  yargs
    .option("assets", {
      type: "boolean",
      default: true,
      describe: "[Experimental] Download assets",
    })
    .option("preview", {
      type: "boolean",
      default: false,
      describe: "[Experimental] Use preview version of the project",
    })
    .option("template", {
      type: "array",
      string: true,
      default: [] as string[],

      coerce: (values: string[]) => {
        const templates = [];
        for (const value of values) {
          const template =
            PROJECT_TEMPLATES.find((item) => item.value === value) ??
            INTERNAL_TEMPLATES.find((item) => item.value === value);

          if (template == null) {
            templates.push(value);
            continue;
          }

          if ("expand" in template && template.expand != null) {
            templates.push(...template.expand);
            continue;
          }

          templates.push(value);
        }

        return templates;
      },

      describe: `Template to use for the build [choices: ${PROJECT_TEMPLATES.map(
        (item) => item.value
      ).join(", ")}]`,
    });

// @todo: use options.assets to define if we need to download assets
export const build = async (
  options: StrictYargsOptionsToInterface<typeof buildOptions>
) => {
  try {
    await access(LOCAL_DATA_FILE);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      log.error(
        `You need to link a webstudio project before building it. Run \`webstudio link\` to link a project.`
      );
      exit(1);
    }

    throw error;
  }

  await prebuild(options);
};
