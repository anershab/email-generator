import fs from "fs";
import React from "react";
import ReactDOMServer from "react-dom/server";
import { rimrafSync, rimraf } from "rimraf";
import { transformSync } from "@babel/core";
import path from "path";
import { fileURLToPath } from "url";
import { parentPort, workerData } from "worker_threads";
import { v4 as uuidv4 } from "uuid";
import outlookExternalClass from "../consts/outlookExternalClass.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const emailsFolder = path.resolve(__dirname, "../../src/emails");
const tempDir = path.join(__dirname, "..", "temp");
const babelPresets = ["@babel/preset-env", "@babel/preset-react"];

async function transformJsx({
  componentName,
  componentProps,
  workerId,
  isBatchJob,
}) {
  console.info(
    "Worker " + workerId + " started for",
    componentName,
    "with props:",
    JSON.stringify(componentProps)
  );
  const jsxFilePath = path.join(
    emailsFolder,
    componentName,
    `${componentName}.jsx`
  );

  const cssPath = path.join(
    emailsFolder,
    componentName,
    `${componentName}.css`
  );

  const hasCssFile = fs.existsSync(cssPath);

  const rawJsxCode = fs.readFileSync(jsxFilePath, "utf-8");
  const noCssImportsRegex = /^import\s+(['"])(.*?)\1\s*;/gm;
  const jsxCode = rawJsxCode.replace(noCssImportsRegex, "");

  const transformedCode = transformSync(jsxCode, {
    presets: babelPresets,
  }).code;

  const seed = uuidv4();
  const tempModulePath = path.join(tempDir, `${componentName}_${seed}.cjs`);

  try {
    if (!isBatchJob) {
      if (fs.existsSync(tempDir)) {
        rimrafSync(tempDir);
      }
      fs.mkdirSync(tempDir);
    }
    fs.writeFileSync(tempModulePath, transformedCode, "utf-8");
  } catch (error) {
    throw new Error(`Failed in fs operations: ${error}`);
  }

  try {
    const { default: component } = await import(tempModulePath);
    const html = ReactDOMServer.renderToString(
      React.createElement(component.default, componentProps)
    );
    let inlineStyleTag = "";
    if (hasCssFile) {
      const cssCode = fs.readFileSync(cssPath, "utf-8");
      inlineStyleTag = `<style>${hasCssFile ? cssCode : ""}</style>`;
    } else {
      inlineStyleTag = `<style>${hasCssFile ? cssCode : ""}</style>`;
    }
    const finalHTML = `<!DOCTYPE html><html><head><meta http-equiv="Content-Type" content="text/html charset=UTF-8"/>${outlookExternalClass}${inlineStyleTag}</head><body>${html}</body></html>`;
    return finalHTML;
  } catch (error) {
    throw new Error(`Failed in ReactDOMServer operations: ${error}`);
  } finally {
    if (!isBatchJob) {
      rimraf(tempDir);
    }
  }
}

const result = await transformJsx(workerData);
if (result) {
  parentPort.postMessage(result);
}
parentPort.close();
