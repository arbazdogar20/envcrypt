#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { loginCommand } from "./commands/login";
import { logoutCommand } from "./commands/logout";
import { pullCommand } from "./commands/pull";
import { pushCommand } from "./commands/push";
import { listCommand } from "./commands/list";

const program = new Command();

program
  .name("envcrypt")
  .description(
    chalk.bold("Envcrypt") + " — secure environment variable management",
  )
  .version("1.0.0");

program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(pullCommand);
program.addCommand(pushCommand);
program.addCommand(listCommand);

program.parse(process.argv);
