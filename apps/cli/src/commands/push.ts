import { Command } from "commander";
import * as fs from "fs";
import * as path from "path";
import ora from "ora";
import chalk from "chalk";
import { createClient } from "../lib/api";

function parseEnvFile(filePath: string): { key: string; value: string }[] {
  const content = fs.readFileSync(filePath, "utf-8");
  const secrets: { key: string; value: string }[] = [];

  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) return;

    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (key) secrets.push({ key, value });
  });

  return secrets;
}

export const pushCommand = new Command("push")
  .description("Push a local .env file to Envcrypt")
  .requiredOption("-p, --project <slug>", "Project slug")
  .option("-e, --env <environment>", "Environment", "development")
  .option("-i, --input <file>", "Input file", ".env")
  .action(async (options) => {
    const inputPath = path.resolve(process.cwd(), options.input);

    if (!fs.existsSync(inputPath)) {
      console.error(chalk.red(`File not found: ${options.input}`));
      process.exit(1);
    }

    const secrets = parseEnvFile(inputPath);

    if (secrets.length === 0) {
      console.log(chalk.yellow("No secrets found in file"));
      return;
    }

    const spinner = ora(
      `Pushing ${secrets.length} secrets to ${options.project}/${options.env}...`,
    ).start();

    try {
      const client = createClient();
      await client.post(
        `/projects/${options.project}/secrets/${options.env}/bulk`,
        { secrets },
      );

      spinner.succeed(
        chalk.green(
          `Pushed ${secrets.length} secrets to ${options.project}/${options.env}`,
        ),
      );

      secrets.forEach((s) => {
        console.log(`  ${chalk.gray("+")} ${chalk.cyan(s.key)}`);
      });
      console.log("");
    } catch (err: any) {
      spinner.fail(chalk.red("Failed to push secrets"));
      if (err.response?.data?.message) {
        console.error(chalk.red(err.response.data.message));
      }
      process.exit(1);
    }
  });
