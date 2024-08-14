import fileSystem from 'fs'
import {getConsoleArg, requireConsoleArg} from "./ConsoleArguments.js";
import {logInfoGlobal} from "./LogUtils.js";
import {formatString} from "./StringFormat.js";
import path from 'path'

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
    writeFileSync(outputFile, content);
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
        writeFileSync(outputFilePart, content);
    })

    logInfoGlobal(`Success!`)
}

export function readFile(inputExtension) {
    const inputFile = requireConsoleArg("input")
    if (!inputFile.endsWith(inputExtension)) {
        throw new Error(`Input file extension must be ${inputExtension}`)
    }

    return readFileString(inputFile)
}

export function readFileString(path) {
    const inputOptionsEncoding = getConsoleArg("input-options-encoding") || "utf8"
    const inputOptionsFlag = getConsoleArg("input-options-flag") || null

    const options = {
        encoding: inputOptionsEncoding,
        flag: inputOptionsFlag,
    }

    const data = fileSystem.readFileSync(path, options);
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

export function fileExists(path) {
    return fileSystem.existsSync(path)
}

export function isDirectory(path) {
    return fileSystem.lstatSync(path).isDirectory()
}

export function isFile(path) {
    return fileSystem.lstatSync(path).isFile()
}

export function fileStats(path) {
    return fileSystem.lstatSync(path) 
}

export function fileExt(filePath) {
    return path.parse(filePath).ext
}

export function fileBaseName(filePath) {
    return path.parse(filePath).base
}

export function fileName(filePath) {
    return path.parse(filePath).name
}

export function removeFile(filePath) {
    return fileSystem.unlinkSync(filePath)
}

export function writeFileSync(filePath, buffer) {
    fileSystem.writeFileSync(filePath, buffer);
}

export function changePathExt(filePath, ext) {
    return filePath.substr(0, filePath.lastIndexOf(".")) + `.${ext}`
}

export function walkDirectory(dir, callback) {
	fileSystem.readdir(dir, function(err, files) {
		if (err) throw err;
		files.forEach(function(file) {
			var filepath = path.join(dir, file);
			fileSystem.stat(filepath, function(err,stats) {
				if (stats.isDirectory()) {
					walk(filepath, callback);
				} else if (stats.isFile()) {
					callback(filepath, stats);
				}
			});
		});
	});
}