import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log("Class Generator Extension is now active!");

  let disposable = vscode.commands.registerCommand(
    "extension.generateClass",
    async (uri: vscode.Uri) => {
      if (!uri) {
        vscode.window.showErrorMessage("No folder selected. Please try again.");
        return;
      }

      try {
        if (!fs.lstatSync(uri.fsPath).isDirectory()) {
          vscode.window.showErrorMessage("Selected item is not a folder.");
          return;
        }
      } catch (error) {
        vscode.window.showErrorMessage("Error accessing folder: " + error);
        return;
      }

      // Show input box for class name
      const className = await vscode.window.showInputBox({
        prompt: "Choose a name for your class",
        placeHolder: "Enter class name",
      });

      if (!className) {
        vscode.window.showWarningMessage("Class generation cancelled.");
        return;
      }

      // Show input box for JSON input
      const jsonInput = await vscode.window.showInputBox({
        prompt: "Paste your JSON data",
        placeHolder: "Enter JSON here",
        validateInput: (value) => {
          try {
            JSON.parse(value);
            return null;
          } catch {
            return "Invalid JSON format";
          }
        },
      });

      if (!jsonInput) {
        vscode.window.showWarningMessage("Class generation cancelled.");
        return;
      }

      // Parse JSON and generate class
      const jsonData = JSON.parse(jsonInput);
      const classCode = generateClassFromJson(className, jsonData);

      // Write to a file
      const filePath = path.join(uri.fsPath, `${className}.dart`);
      try {
        fs.writeFileSync(filePath, classCode);
        vscode.window.showInformationMessage(`Class ${className} created successfully.`);
      } catch (error) {
        vscode.window.showErrorMessage("Failed to create class file: " );
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log("Class Generator Extension is now deactivated.");
}
function generateClassFromJson(className: string, json: any): string {
  let classes: string[] = [];
  let classCode = generateDartClass(className, json, classes);
  return classes.join("\n\n") + "\n\n" + classCode;
}

function generateDartClass(className: string, json: any, classes: string[]): string {
  let classProperties = Object.keys(json)
    .map((key) => {
      let type = getDartType(json[key], key, classes);
      return `  final ${type} ${key};`;
    })
    .join("\n");

  let constructorParams = Object.keys(json)
    .map((key) => `    required this.${key},`)
    .join("\n");

  let fromJsonParams = Object.keys(json)
    .map((key) => `      ${key}: ${convertFromJson(json[key], key)},`)
    .join("\n");

  let toJsonParams = Object.keys(json)
    .map((key) => `      '${key}': ${convertToJson(json[key], key)},`)
    .join("\n");

  return `
class ${className} {
${classProperties}

  ${className}({
${constructorParams}
  });

  factory ${className}.fromJson(Map<String, dynamic> json) {
    return ${className}(
${fromJsonParams}
    );
  }

  Map<String, dynamic> toJson() {
    return {
${toJsonParams}
    };
  }
}`;
}

// Determines the Dart type for a given JSON value
function getDartType(value: any, key: string, classes: string[]): string {
  if (typeof value === "number") {
    return value % 1 === 0 ? "int" : "double";
  }
  if (typeof value === "boolean") {
    return "bool";
  }
  if (typeof value === "string") {
    return "String";
  }
  if (Array.isArray(value)) {
    if (value.length > 0) {
      let itemType = getDartType(value[0], key, classes);
      return `List<${itemType}>`;
    }
    return "List<dynamic>";
  }
  if (typeof value === "object" && value !== null) {
    let className = capitalize(key);
    classes.push(generateDartClass(className, value, classes));
    return className;
  }
  return "dynamic";
}

// Converts JSON values when deserializing (from JSON to Dart object)
function convertFromJson(value: any, key: string): string {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object") {
      let className = capitalize(key);
      return `(json['${key}'] as List).map((item) => ${className}.fromJson(item)).toList()`;
    }
    return `List.from(json['${key}'])`;
  }
  if (typeof value === "object" && value !== null) {
    let className = capitalize(key);
    return `${className}.fromJson(json['${key}'])`;
  }
  return `json['${key}']`;
}

// Converts Dart values when serializing (to JSON)
function convertToJson(value: any, key: string): string {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object") {
      return `${key}.map((item) => item.toJson()).toList()`;
    }
    return key;
  }
  if (typeof value === "object" && value !== null) {
    return `${key}.toJson()`;
  }
  return key;
}

// Capitalizes the first letter of a string
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
