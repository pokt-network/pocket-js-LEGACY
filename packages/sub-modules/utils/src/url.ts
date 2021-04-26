/**
 * Validates wheter or not a Service URL is valid
 * @param serviceURL 
 */
export function validateServiceURL(serviceURL: URL): boolean {
    return serviceURL.protocol === "https:" && !!serviceURL.hostname === true
}