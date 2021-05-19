import { ProfileResult } from "./models/profile-result";

/**
 * Base Profiler
 */
 export abstract class BaseProfiler {
     public data: {key: string, time_elapsed: number | undefined}[] = []

    /**
     * Handles the profiler results
     * @param { any } data - Object that can hold any extra information for metrics.
     * @param { string } functionName - Main function name.
     * @param { ProfileResult[] } results - Profile results array
     * @memberof BaseProfiler
     */
     abstract flushResults(data: any, functionName: string, results: ProfileResult[]): Promise<void>;
}