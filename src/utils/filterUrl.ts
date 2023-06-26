export function checkFilter (key: string, value: string) {
    if (value !== "" && value !== undefined && value !== null) {
        return `&${key}=${value}`
    }
    return ""
}