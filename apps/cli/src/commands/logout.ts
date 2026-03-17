import { Command } from "commander";
import chalk from "chalk";
import { clearConfig } from "../lib/config";

export const logoutCommand = new Command("logout")
  .description("Log out of Envcrypt")
  .action(() => {
    clearConfig();
    console.log(chalk.green("\nLogged out successfully\n"));
  });
