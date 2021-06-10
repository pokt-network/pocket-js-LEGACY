/**
 *
 *
 * @class ProfileResult
 */
 export class ProfileResult { 
    public readonly blockKey: string
    public timeElapsed: number
    private readonly startTime: number
  
    /**
     * Profile result.
     * @constructor
     * @param {string} blockKey - Code Block key name.
     */
    constructor(
      blockKey: string,
    ) {
      this.blockKey = blockKey
      this.timeElapsed = 0

      // Start the recording
      this.startTime = new Date().valueOf()
    
    }
    /**
     *
     * Saves the current recording
     * @returns {JSON} - JSON Object.
     * @memberof ProfileResult
     */
    public save() {
        this.timeElapsed = new Date().valueOf() - this.startTime
    }

    /**
     *
     * Returns an object with the recording results
     * @returns {JSON} - JSON Object.
     * @memberof ProfileResult
     */
    public toJSON() {
        return {
            block_key: this.blockKey,
            time_elapsed: this.timeElapsed
        }
    }
  }
  