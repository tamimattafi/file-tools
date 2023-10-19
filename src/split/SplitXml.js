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

    const header = appendHeader ? lines[0] : ""
    const footer = appendFooter ? lines[lines.length - 1] : ""
    const addsOnSize = header.length + footer.length
    if (addsOnSize > outputMaxSize) {
        throw new Error(`Header and footer combination is larger than outputMaxSize ${outputMaxSize}`)
    }

    const startIndex = appendHeader ? 1 : 0
    const endIndex = appendFooter ? lines.length - 1 : lines.length

    for (let index = startIndex; index < endIndex; index++) {
        const line = lines[index]

        if (line.length > outputMaxSize) {
            throw new Error(`Line at ${index} is larger than outputMaxSize ${outputMaxSize}`)
        }

        let newOutputLength = outputContent.length() + line.length + footer.length
        if (newOutputLength > outputMaxSize) {
            if (appendFooter) {
                outputContent.appendLine(footer)
            }

            convertedParts.push(outputContent.toString())

            outputContent.clear()

            if (appendHeader) {
                outputContent.appendLine(header)
            }
        }

        outputContent.appendLine(line)
    }

    if (outputContent.length() > 0) {
        convertedParts.push(outputContent.toString())
    }

    logInfoGlobal(`Successfully split ${inputExtension} to ${convertedParts.length} ${outputExtension} parts`)
    return convertedParts
}
