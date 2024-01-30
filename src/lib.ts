import { print } from "kolmafia";

export function warn(message: string): void {
  print(message, "red");
}
