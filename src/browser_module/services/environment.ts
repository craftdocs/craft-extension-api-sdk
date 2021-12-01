import { Environment, EnvironmentListener } from "@craftdocs/craft-extension-api"
import { deepCopy } from "../tools/objects"
import { Writeable } from "../tools/types"

class EnvironmentService {
  private env: Writeable<Environment> = { colorScheme: "light", platform: "Web" }
  private listener: EnvironmentListener | null = null

  public setEnv(env: Partial<Environment>) {
    const prev = deepCopy(this.env)

    if (env.colorScheme !== undefined) {
      this.env.colorScheme = env.colorScheme
    }

    if (env.platform !== undefined) {
      this.env.platform = env.platform
    }

    const current = deepCopy(this.env)

    if (this.listener) {
      this.listener(current, prev)
    }
  }

  public get current(): Environment {
    return deepCopy(this.env)
  }

  public setListener(listener: EnvironmentListener | null) {
    this.listener = listener
  }
}

export const EnvironmentServiceInstance = new EnvironmentService()
