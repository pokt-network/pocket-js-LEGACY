import { SessionHeader } from "../models/input/SessionHeader"
import { Session } from "../models/output/Session"
import { LocalStorageHelper } from "./storage/LocalStorageHelper"

/**
 *
 *
 * @class SessionManager
 * This class provides a TypeScript implementation of the bech32 format specified in BIP 173 --> https://github.com/bitcoin/bips/blob/master/bip-0173.mediawiki.
 */

 export class SessionManager {

    public static createSession(header: SessionHeader): Promise<string> {
        // TODO: Get this promise from the request manager
        const promise: Promise<string> = new Promise<string>((result, reject) => {
            
            if(result !== undefined){
                LocalStorageHelper.add("session", result.toString())
            } else {
                reject("Session could not be created!")
            }
        })
        return promise
    }
 }