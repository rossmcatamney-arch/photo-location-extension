export class EnvironmentService {
  static isHosted() {
    return window.self !== window.top;
  }

  static getEnvironmentName() {
    return this.isHosted()
      ? "Hosted"
      : "Standalone";
  }
}