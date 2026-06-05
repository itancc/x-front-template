import pkg from "../package.json";
import { type ConfigEnv } from "vite";

export function createViteDefine({ mode }: ConfigEnv) {
  return {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __APP_NAME__: JSON.stringify(pkg.name),
    __DEV__: mode === "development",
  };
}
