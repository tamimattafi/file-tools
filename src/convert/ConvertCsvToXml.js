import {getConsoleArg} from "../common/ConsoleArguments.js"
import StringBuilder from "node-stringbuilder"
import {formatString} from "../common/StringFormat.js"
import {manipulateFile} from "../common/FileUtils.js";
import {logErrorGlobal, logInfoGlobal} from "../common/LogUtils.js";

const inputExtension = 'csv'
const outputExtension = 'xml'

const defaultOutputTag = "string"
const defaultOutputKey = "name"
const templateWithValueProperty = "<%s %s=\"%s\" %s=\"%s\"/>"
const templateWithoutValueProperty = "<%s %s=\"%s\">%s</%s>"

const lineSeparator = "\n"
const csvColumnSeparator = ","

try {
  manipulateFile(inputExtension, outputExtension, convertData)
} catch (error) {
  logErrorGlobal(error)
}

function convertData(data) {
  logInfoGlobal(`Converting ${inputExtension} to ${outputExtension}...`)

  const outputTag = getConsoleArg("output-tag") || defaultOutputTag
  const outputKeyProperty = getConsoleArg("output-key") || defaultOutputKey
  const outputValueProperty = getConsoleArg("output-value")

  let convertedLines = 0
  const outputContent = new StringBuilder()
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
          key.trim(),
          outputValueProperty,
          value.trim()
      )
    } else {
      xmlLine = formatString(
          templateWithoutValueProperty,
          outputTag,
          outputKeyProperty,
          key.trim(),
          value.trim(),
          outputTag
      )
    }

    outputContent.appendLine(xmlLine)
    convertedLines++
  })


  logInfoGlobal(`Successfully converted ${convertedLines} ${inputExtension} lines to ${outputExtension}`)
  return outputContent.toString()
}
