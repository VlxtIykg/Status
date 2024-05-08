export default class NoIDGivenError extends Error {
  constructor(functionName) {
    super(`No ID was provided in ${functionName}`);
    this.name = "NoIDGivenError";
    this.code = "NO_ID_PROVIDED";
    console.error(`${this.name}: No ID was provided in ${functionName}.`)
    Error.captureStackTrace(this, this.constructor);
  }
}