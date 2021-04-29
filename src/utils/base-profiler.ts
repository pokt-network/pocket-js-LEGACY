import { ProfileResult } from "./models/profile-result";

/**
 * Base Profiler
 */
 export abstract class BaseProfiler {
     public data: {key: string, time_elapsed: number | undefined}[] = []

     abstract flushResults(functionName: string, results: ProfileResult[]): void;
}