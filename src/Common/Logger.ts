import { CosmosError, getErrorMessage } from "./ErrorHandlingUtils";
import { sendMessage } from "./MessageHandler";
import { Diagnostics, MessageTypes } from "../Contracts/ExplorerContracts";
import { appInsights } from "../Shared/appInsights";
import { SeverityLevel } from "@microsoft/applicationinsights-web";

// TODO: Move to a separate Diagnostics folder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function logInfo(message: string | Record<string, any>, area: string, code?: number): void {
  let logMessage: string;
  if (typeof message === "string") {
    logMessage = message;
  } else {
    logMessage = JSON.stringify(message, Object.getOwnPropertyNames(message));
  }
  const entry: Diagnostics.LogEntry = _generateLogEntry(Diagnostics.LogEntryLevel.Verbose, logMessage, area, code);
  return _logEntry(entry);
}

export function logWarning(message: string, area: string, code?: number): void {
  const entry: Diagnostics.LogEntry = _generateLogEntry(Diagnostics.LogEntryLevel.Warning, message, area, code);
  return _logEntry(entry);
}

export function logError(error: string | CosmosError | Error, area: string, code?: number): void {
  const errorMessage: string = getErrorMessage(error);
  const entry: Diagnostics.LogEntry = _generateLogEntry(Diagnostics.LogEntryLevel.Error, errorMessage, area, code);
  return _logEntry(entry);
}

function _logEntry(entry: Diagnostics.LogEntry): void {
  sendMessage({
    type: MessageTypes.LogInfo,
    data: JSON.stringify(entry)
  });

  const severityLevel = ((level: Diagnostics.LogEntryLevel): SeverityLevel => {
    switch (level) {
      case Diagnostics.LogEntryLevel.Custom:
      case Diagnostics.LogEntryLevel.Debug:
      case Diagnostics.LogEntryLevel.Verbose:
        return SeverityLevel.Verbose;
      case Diagnostics.LogEntryLevel.Warning:
        return SeverityLevel.Warning;
      case Diagnostics.LogEntryLevel.Error:
        return SeverityLevel.Error;
      default:
        return SeverityLevel.Information;
    }
  })(entry.level);
  appInsights.trackTrace({ message: entry.message, severityLevel }, { area: entry.area });
}

function _generateLogEntry(
  level: Diagnostics.LogEntryLevel,
  message: string,
  area: string,
  code?: number
): Diagnostics.LogEntry {
  return {
    timestamp: new Date().getUTCSeconds(),
    level,
    message,
    area,
    code
  };
}
