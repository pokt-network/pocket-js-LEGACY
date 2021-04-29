import { ProfileResult } from "./models/profile-result";
import { BaseProfiler } from "./base-profiler";

/**
 * Profiler
 */
 export class NoOpProfiler extends BaseProfiler {
     public data: {key: string, time_elapsed: number | undefined}[] = []

     flushResults(functionName: string, results: ProfileResult[]): void {
         // empty block
     }
}