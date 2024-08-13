import {getConsoleArg} from "../common/ConsoleArguments.js"
import {logErrorGlobal, logInfoGlobal} from "../common/LogUtils.js";
import { DotLottie } from '@dotlottie/dotlottie-js/node'
import {fileExists, isDirectory, walkDirectory, fileStats, fileExt, fileName, readFileString} from "../common/FileUtils.js";

const inputExtension = 'json'
const outputExtension = 'lottie'

const defaultAuthor = "Lottie"
const defaultVersion = "1.0"


try {
  convert()
} catch (error) {
  logErrorGlobal(error)
}

async function convert() {
  const folder = getConsoleArg("folder")
  const file = getConsoleArg("file")

  if (folder !== null && folder.length !== 0) {
    convertFolder(folder)
  }

  if (file !== null && file.length !== 0) {
    convertFile(file, fileStats(file))
  }
}

async function convertFile(path, stats) {
  if (fileExt(path) !== `.${inputExtension}`) {
    logInfoGlobal(`Skipping ${inputExtension} ${path}...`)
    return
  }


  const name = fileName(path)
  const downloadName = `${path}.lottie`

  const author = getConsoleArg("author") || defaultAuthor
  const version = getConsoleArg("version") || defaultVersion
  const data = readFileString(path)
  logInfoGlobal(`data ${data}`)

  logInfoGlobal(`Converting ${name} to ${outputExtension}...`)

  const dotLottie = new DotLottie();
  await dotLottie
  .setAuthor(author)
  .setVersion(version)
  .addAnimation({
    id: name,
    data: data,
    loop: true,
    autoplay: true
  })
  .build()
  .then((value) => {
    value.download(downloadName);
  })
  .then((response) => {
    logInfoGlobal(`Downloaded ${downloadName}...`)
  })
}

async function convertFolder(folder) {
  if (folder === null || folder.length === 0) {
    throw Error("Folder was not specified using --folder=\"your/folder\" argument")
  }

  if (!fileExists(folder)) {
    throw Error("Folder does not exist")
  }

  if (!isDirectory(folder)) {
    throw Error("Folder is not a directory")
  }

  walkDirectory(folder, convertFile)
}