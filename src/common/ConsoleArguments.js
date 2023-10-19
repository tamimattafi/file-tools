import {logInfoGlobal} from "./LogUtils.js";

export function requireConsoleArg(key) {
    const arg = getConsoleArg(key)
    if (arg == null) {
        logInfoGlobal(`process args: ${process.argv}`)
        throw new Error(`Argument ${key} is required but doesn't have a value`)
    }

    return arg
}

export const hasConsoleFlagArg = (key) => {
    const arg = getConsoleArg(key)
    if (!arg) {
        return null
    }

    return arg === "true"
}

export const getConsoleArg = (key) => {
    const parameter = `--${key}=`
    const value = process.argv.find((element) => {
        return element.startsWith(parameter)
    })

    // Return null if the key does not exist and a value is not defined
    if (!value) {
        return null
    }

    return value.replace(parameter, '')
}
