import fileSystem from 'fs'
import {requireConsoleArg, getConsoleArg} from "../common/ConsoleArguments.js"
import StringBuilder from "node-stringbuilder"
import {formatString} from "../common/StringFormat.js"

export function convertFile() {
  const data = readFile()
  const convertedData = convertData(data)
  writeFile(convertedData)
}

function readFile() {
  const inputFile = requireConsoleArg("input")
  if (!inputFile.endsWith('csv')) {
    throw new Error("Input file extension must be csv")
  }

  const inputOptionsEncoding = getConsoleArg("input-options-encoding") || "utf8"
  const inputOptionsFlag = getConsoleArg("input-options-flag") || null

  const options = {
    encoding: inputOptionsEncoding,
    flag: inputOptionsFlag,
  }

  console.log(`Reading file ${inputFile} with options ${JSON.stringify(options)}`)
  const data = fileSystem.readFileSync(inputFile, options);

  console.log(`Got data of length ${data.length}`)
  return data.toString(inputOptionsEncoding, 0, data.length);
}

function convertData(data) {
  console.log("Converting csv to xml...")

  const defaultOutputTag = "string"
  const defaultOutputKey = "name"
  const templateWithValueProperty = "<%s %s=\"%s\" %s=\"%s\"/>"
  const templateWithoutValueProperty = "<%s %s=\"%s\">%s</%s>"

  const outputTag = getConsoleArg("output-tag") || defaultOutputTag
  const outputKeyProperty = getConsoleArg("output-key") || defaultOutputKey
  const outputValueProperty = getConsoleArg("output-value")

  const outputContent = new StringBuilder()

  const lineSeparator = "\n"
  const csvColumnSeparator = ","
  data.split(lineSeparator).forEach((line) => {
    if (line === '' || line === lineSeparator || line === csvColumnSeparator) {
      return
    }

    const [key, value] = line.split(csvColumnSeparator)

    let xmlLine = ""
    if(!!outputValueProperty) {
      xmlLine = formatString(
          templateWithValueProperty,
          outputTag,
          outputKeyProperty,
          key,
          outputValueProperty,
          value
      )
    } else {
      xmlLine = formatString(
          templateWithoutValueProperty,
          outputTag,
          outputKeyProperty,
          key,
          value,
          outputTag
      )
    }

    outputContent.appendLine(xmlLine)
  })

  return outputContent.toString()
}

function writeFile(content) {
  const outputFile = getConsoleArg("output") || requireConsoleArg("input").replaceAll('csv', 'xml')
  if (!outputFile.endsWith('xml')) {
    throw new Error("Output file extension must be xml")
  }

  console.log(`Writing data of length ${content.length} to ${outputFile}`)
  fileSystem.writeFileSync(outputFile, content);
}

try {
  convertFile()
} catch (error) {
  console.error(error)
}