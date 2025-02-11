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

      const className = await vscode.window.showInputBox({
        prompt: "Choose a name for your class",
        placeHolder: "Enter class name",
      });

      if (!className) {
        vscode.window.showWarningMessage("Class generation cancelled.");
        return;
      }

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

      const jsonData = JSON.parse(jsonInput);
      const classCode = generateClassFromJson(className, jsonData);

      const filePath = path.join(uri.fsPath, `${className}.dart`);
      try {
        fs.writeFileSync(filePath, classCode);
        vscode.window.showInformationMessage(`Class ${className} created successfully.`);
      } catch (error) {
        vscode.window.showErrorMessage("Failed to create class file: " + error);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {
  console.log("Class Generator Extension is now deactivated.");
}
function generateClassFromJson(className: string, json: any): string {
  let classes = new Map<string, string>(); // Store unique classes
  generateDartClass(className, json, classes); // Generate all classes first

  // Ensure the main class appears first and is not duplicated
  let mainClass = classes.get(className);
  classes.delete(className);

  return (mainClass ? mainClass + "\n\n" : "") + Array.from(classes.values()).join("\n\n");
}


function generateDartClass(className: string, json: any, classes: Map<string, string>): string {
  if (classes.has(className)) return ""; // Prevent duplicate classes

  let classProperties = Object.keys(json)
    .map((key) => {
      let type = getDartType(json[key], key, classes);
      return `  final ${type}? ${key};`;
    })
    .join("\n");

  let constructorParams = Object.keys(json)
    .map((key) => `    this.${key},`)
    .join("\n");

  let fromJsonParams = Object.keys(json)
    .map((key) => `      ${key}: ${convertFromJson(json[key], key)},`)
    .join("\n");

  let toJsonParams = Object.keys(json)
    .map((key) => `      '${key}': ${convertToJson(json[key], key)},`)
    .join("\n");

  let copyWithParams = Object.keys(json)
    .map((key) => `${getDartType(json[key], key, classes)}? ${key},`)
    .join("\n");

  let copyWithAssignments = Object.keys(json)
    .map((key) => `${key}: ${key} ?? this.${key},`)
    .join("\n");

  let dartClass = `
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

  ${className} copyWith({
${copyWithParams}
  }) {
    return ${className}(
${copyWithAssignments}
    );
  }
}`;
  
  classes.set(className, dartClass); // Store unique class

  return dartClass;
}
function getDartType(value: any, key: string, classes: Map<string, string>): string {
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
    if (!classes.has(className)) {
      classes.set(className, generateDartClass(className, value, classes)); // Store only unique classes
    }
    return className;
  }
  return "dynamic";
}

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

function convertToJson(value: any, key: string): string {
  if (Array.isArray(value)) {
    if (value.length > 0 && typeof value[0] === "object") {
      return `${key}?.map((item) => item.toJson()).toList()`;
    }
    return key;
  }
  if (typeof value === "object" && value !== null) {
    return `${key}?.toJson()`;
  }
  return key;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
