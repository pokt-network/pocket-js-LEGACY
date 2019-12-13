import axios, { AxiosInstance } from "axios";
import constants = require("../utils/constants");
import { Configuration } from "../configuration/configuration";

// Report
/**
 *
 *
 * @class Report
 */
export class Report {
  public readonly ip: string;
  public readonly message: string;
  public readonly configuration: Configuration;
  /**
   * Creates an instance of Report.
   * @param {String} ip - Internet protocol address of the node.
   * @param {String} message - Message describing the report.
   * @param {Configuration} configuration - Configuration object.
   * @memberof Report
   */
  constructor(ip: string, message: string, configuration: Configuration) {
    this.ip = ip;
    this.message = message;
    this.configuration = configuration;
  }
  /**
   *
   * Parse properties to a JSON Object.
   * @returns {JSON} - A JSON Object.
   * @memberof Report
   */
  public toJSON() {
    return {
      IP: this.ip,
      Message: this.message
    };
  }
  /**
   *
   * Verifies if the Report is valid
   * @returns {boolean} - True or false
   * @memberof Report
   */
  public isValid() {
    for (const property in this) {
      if (!this.hasOwnProperty(property) || property != null) {
        return false;
      }
    }
    return true;
  }
  /**
   *
   * Sends a report to the dispatcher.
   * @param {callback} callback
   * @returns {String} - An string with the result.
   * @memberof Report
   */
  public async send(callback: (result?: any, error?: Error) => any) {
    const axiosInstance = axios.create({
      baseURL: constants.dispatchNodeURL,
      headers: {
        "Content-Type": "application/json"
      },
      timeout: this.configuration.requestTimeOut
    });

    const response = await axiosInstance.post(
      constants.reportPath,
      this.toJSON()
    );

    if (response.status === 200 && response.data != null) {
      if (callback) {
        callback(null, response.data);
        return;
      }
      return response.data;
    } else {
      if (callback) {
        callback(
          new Error("Failed to send report with error: " + response.data)
        );
        return;
      }
      return new Error("Failed to send report with error: " + response.data);
    }
  }
}
