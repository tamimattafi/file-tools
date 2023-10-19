const GLOBAL_TAG = 'file-tools'

export function logInfoGlobal(message) {
    logInfo(GLOBAL_TAG, message)
}

export function logErrorGlobal(message) {
    logError(GLOBAL_TAG, message)
}

export function logInfo(tag, message) {
    console.log(`${tag}: ${message}`)
}

export function logError(tag, message) {
    console.error(`${tag}: ${message}`)
}
