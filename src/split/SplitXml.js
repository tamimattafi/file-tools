import {getConsoleArg, hasConsoleFlagArg} from "../common/ConsoleArguments.js"
import StringBuilder from "node-stringbuilder"
import {manipulateFileAsParts} from "../common/FileUtils.js";
import {logErrorGlobal, logInfoGlobal} from "../common/LogUtils.js";

const inputExtension = 'xml'
const outputExtension = 'xml'

const lineSeparator = "\n"

const defaultMaxSize = 10_000
const defaultAppendHeader = true
const defaultAppendFooter = true

try {
    manipulateFileAsParts(inputExtension, outputExtension, splitData)
} catch (error) {
    logErrorGlobal(error)
}

function splitData(data) {
    logInfoGlobal(`Splitting ${inputExtension} to many ${outputExtension} parts...`)

    const outputMaxSize = getConsoleArg("output-max-size") || defaultMaxSize
    const appendHeader = hasConsoleFlagArg("output-append-header") || defaultAppendHeader
    const appendFooter = hasConsoleFlagArg("output-append-footer") || defaultAppendFooter

    let convertedParts = []
    const outputContent = new StringBuilder()
    const lines = data.trim().split(lineSeparator)

    const header = appendHeader ? lines[0].trim() : ""
    const footer = appendFooter ? lines[lines.length - 1].trim() : ""
    const addsOnSize = header.length + footer.length
    if (addsOnSize > outputMaxSize) {
        throw new Error(`Header and footer combination is larger than outputMaxSize ${outputMaxSize}`)
    }

    const startIndex = appendHeader ? 1 : 0
    const endIndex = appendFooter ? lines.length - 1 : lines.length

    const tryAppendHeader = () => {
        const currentLength = outputContent.length()
        if (appendHeader && currentLength <= 0) {
            outputContent.appendLine(header)
        }
    }

    const appendData = (data) => {
        tryAppendHeader()
        outputContent.appendLine(data)
    }

    const tryAppendFooter = () => {
        const currentLength = outputContent.length()
        if (appendFooter && currentLength > 0) {
            outputContent.appendLine(footer)
        }
    }

    const addCurrentPart = () => {
        const currentLength = outputContent.length()
        if (currentLength > 0) {
            tryAppendFooter()
            convertedParts.push(outputContent.toString().trim())
            outputContent.clear()
        }
    }

    for (let index = startIndex; index < endIndex; index++) {
        const line = lines[index]

        if (line.length > outputMaxSize) {
            throw new Error(`Line at ${index} is larger than outputMaxSize ${outputMaxSize}`)
        }

        let newOutputLength = outputContent.length() + line.length + footer.length
        if (newOutputLength > outputMaxSize) {
            addCurrentPart()
        }

        appendData(line)
    }

    addCurrentPart()

    logInfoGlobal(`Successfully split ${inputExtension} to ${convertedParts.length} ${outputExtension} parts`)
    return convertedParts
}
