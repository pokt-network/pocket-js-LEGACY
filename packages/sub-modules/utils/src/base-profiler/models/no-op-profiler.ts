import { ProfileResult } from "./profile-result";
import { BaseProfiler } from "../base-profiler";

/**
 * NoOpProfiler
 */
 export class NoOpProfiler extends BaseProfiler {
     public data: {key: string, time_elapsed: number | undefined}[] = []

    /**
     * Handles the profiler results
     * @param { any } data - Object that can hold any extra information for metrics.
     * @param { string } functionName - Main function name.
     * @param { ProfileResult[] } results - Profile results array
     * @memberof NoOpProfiler
     */
     async flushResults(data: any, functionName: string, results: ProfileResult[]): Promise<void> {
         // empty block
     }
}