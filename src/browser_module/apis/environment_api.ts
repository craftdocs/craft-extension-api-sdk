import { EnvironmentApi, EnvironmentListener } from "@craftdocs/craft-extension-api"
import { EnvironmentServiceInstance } from "../services/environment"

export class EnvironmentApiMock implements EnvironmentApi {
  constructor(private env = EnvironmentServiceInstance) {
  }

  public setListener(listener: EnvironmentListener | null): void {
    this.env.setListener(listener)
  }
}
