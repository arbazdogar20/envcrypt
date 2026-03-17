import { Command } from "commander";
import chalk from "chalk";
import ora from "ora";
import { createClient } from "../lib/api";

export const listCommand = new Command("list")
  .description("List all secrets for a project environment")
  .requiredOption("-p, --project <slug>", "Project slug")
  .option("-e, --env <environment>", "Environment", "development")
  .option("--reveal", "Show secret values", false)
  .action(async (options) => {
    const spinner = ora("Fetching secrets...").start();

    try {
      const client = createClient();
      const res = await client.get(
        `/projects/${options.project}/secrets/${options.env}`,
      );

      const secrets: { key: string; value: string }[] = res.data;
      spinner.stop();

      if (secrets.length === 0) {
        console.log(chalk.yellow(`\nNo secrets in ${options.env}\n`));
        return;
      }

      console.log(
        chalk.bold(
          `\n${options.project} / ${options.env} — ${secrets.length} secrets\n`,
        ),
      );

      secrets.forEach((s) => {
        const val = options.reveal
          ? chalk.gray(s.value)
          : chalk.gray("••••••••");
        console.log(`  ${chalk.cyan(s.key.padEnd(30))} ${val}`);
      });

      if (!options.reveal) {
        console.log(chalk.gray("\n  Use --reveal to show values\n"));
      } else {
        console.log("");
      }
    } catch (err: any) {
      spinner.fail(chalk.red("Failed to list secrets"));
      process.exit(1);
    }
  });
