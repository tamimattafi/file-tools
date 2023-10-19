import fileSystem from 'fs'
import {getConsoleArg, requireConsoleArg} from "./ConsoleArguments.js";
import {logInfoGlobal} from "./LogUtils.js";
import {formatString} from "./StringFormat.js";

const filePartTemplate = "%s_%s.%s"

export function getOutputFile(inputExtension, outputExtension) {
    const outputFile = getConsoleArg("output") || requireConsoleArg("input")
        .replaceAll(inputExtension, outputExtension)

    if (!outputFile.endsWith(outputExtension)) {
        throw new Error(`Output file extension must be ${outputExtension}`)
    }

    return outputFile
}

export function getOutputFilePart(outputFile, index, outputExtension) {
    const outputExtensionFull = `.${outputExtension}`
    const baseOutputFile = outputFile.replaceAll(outputExtensionFull, '')
    return formatString(filePartTemplate, baseOutputFile, index, outputExtension)
}

export function writeFile(content, inputExtension, outputExtension) {
    const outputFile = getOutputFile(inputExtension, outputExtension)
    logInfoGlobal(`Writing data of length ${content.length} to ${outputFile}`)
    fileSystem.writeFileSync(outputFile, content);
    logInfoGlobal(`Success!`)
}

export function writeFiles(contents, inputExtension, outputExtension) {
    if (contents.length === 1) {
        writeFile(contents[0], inputExtension, outputExtension)
        return
    }
    
    const outputFile = getOutputFile(inputExtension, outputExtension)
    contents.forEach((content, index) => {
        const outputFilePart = getOutputFilePart(outputFile, index, outputExtension)
        logInfoGlobal(`Writing data of length ${content.length} to ${outputFilePart}`)
        fileSystem.writeFileSync(outputFilePart, content);
    })

    logInfoGlobal(`Success!`)
}

export function readFile(inputExtension) {
    const inputFile = requireConsoleArg("input")
    if (!inputFile.endsWith(inputExtension)) {
        throw new Error(`Input file extension must be ${inputExtension}`)
    }

    const inputOptionsEncoding = getConsoleArg("input-options-encoding") || "utf8"
    const inputOptionsFlag = getConsoleArg("input-options-flag") || null

    const options = {
        encoding: inputOptionsEncoding,
        flag: inputOptionsFlag,
    }

    logInfoGlobal(`Reading file ${inputFile} with options ${JSON.stringify(options)}`)
    const data = fileSystem.readFileSync(inputFile, options);

    logInfoGlobal(`Got data of length ${data.length}`)
    return data.toString(inputOptionsEncoding, 0, data.length);
}

export function manipulateFile(inputExtension, outputExtension, manipulateData) {
    const data = readFile(inputExtension)
    const manipulatedData = manipulateData(data)
    writeFile(manipulatedData, inputExtension, outputExtension)
}

export function manipulateFileAsParts(inputExtension, outputExtension, manipulateDataParts) {
    const data = readFile(inputExtension)
    const manipulatedDataParts = manipulateDataParts(data)
    writeFiles(manipulatedDataParts, inputExtension, outputExtension)
}

