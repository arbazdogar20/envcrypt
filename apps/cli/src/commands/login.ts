import { Command } from "commander";
import ora from "ora";
import chalk from "chalk";
import axios from "axios";
import { setConfig, getApiUrl } from "../lib/config";
import { input, password } from "@inquirer/prompts";

export const loginCommand = new Command("login")
  .description("Authenticate with your Envcrypt account")
  .action(async () => {
    console.log(chalk.bold("\nEnvcrypt Login\n"));

    const email = await input({ message: "Email:" });

    const userPassword = await password({
      message: "Password:",
      mask: "*",
    });

    const spinner = ora("Authenticating...").start();

    try {
      const res = await axios.post(`${getApiUrl()}/auth/login`, {
        email,
        password: userPassword,
      });

      setConfig({ token: res.data.token });
      spinner.succeed(chalk.green(`Logged in as ${res.data.user.email}`));
    } catch {
      spinner.fail(chalk.red("Invalid email or password"));
      process.exit(1);
    }
  });
