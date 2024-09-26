---
layout: post
title: Vscode配置C++环境
date: 2024-09-26 11:06:44
cover: 
top: 
tags: 
  - C++
categories: 其他
# author: @Remsait
---
## 前言
&emsp; 单纯想用Vscode运行C++代码来做点题
<!--more-->

## 安装 MinGW
参考文章   
<https://blog.csdn.net/qq_38196449/article/details/136125995#:~:text=MinGW%20%E6%9C%80%E5%A4%A7%E7%9A%84%E7%89%B9>
安装完后记得配置环境变量

## 配置C++
首先安装两个插件：
- C/C++
- C/C++ Compile Run

扩展插件会自动安装  

然后在代码文件夹创建一个`.vscode`文件夹，里面包含四个文件
`c_cpp_properties.json`
```json
{
  "configurations": [
      {
          "name": "Win32",
          "includePath": [
              "${workspaceFolder}/**"
          ],
          "defines": [
              "_DEBUG",
              "UNICODE",
              "_UNICODE"
          ],
          "cStandard": "c17",
          "cppStandard": "gnu++14",
          "intelliSenseMode": "windows-gcc-x64",
          "compilerPath": "D:/mingw/bin/g++.exe"
      }
  ],
  "version": 4
}
```

`lanch.json`
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "g++ - 生成并调试活动文件",
            "type": "cppdbg",
            "request": "launch",
            "program": "${fileDirname}/${fileBasenameNoExtension}.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": true,
            "MIMode": "gdb",
            "miDebuggerPath": "D:/mingw/bin/gdb.exe",
            "setupCommands": [
                {
                    "description": "为 gdb 启用漂亮打印",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "C/C++: g++.exe 生成活动文件",
            "console": "externalTerminal",  // 在外部终端中运行
            "logging": {
                "moduleLoad": false
            },
            "launchCompleteCommand": "exec-run"
        }
    ]
}
```
`setting.json`
```json
{
  "C_Cpp_Runner.cCompilerPath": "gcc",
  "C_Cpp_Runner.cppCompilerPath": "g++",
  "C_Cpp_Runner.debuggerPath": "gdb",
  "C_Cpp_Runner.cStandard": "",
  "C_Cpp_Runner.cppStandard": "",
  "C_Cpp_Runner.msvcBatchPath": "C:/Program Files/Microsoft Visual Studio/VR_NR/Community/VC/Auxiliary/Build/vcvarsall.bat",
  "C_Cpp_Runner.useMsvc": false,
  "C_Cpp_Runner.warnings": [
    "-Wall",
    "-Wextra",
    "-Wpedantic",
    "-Wshadow",
    "-Wformat=2",
    "-Wcast-align",
    "-Wconversion",
    "-Wsign-conversion",
    "-Wnull-dereference"
  ],
  "C_Cpp_Runner.msvcWarnings": [
    "/W4",
    "/permissive-",
    "/w14242",
    "/w14287",
    "/w14296",
    "/w14311",
    "/w14826",
    "/w44062",
    "/w44242",
    "/w14905",
    "/w14906",
    "/w14263",
    "/w44265",
    "/w14928"
  ],
  "C_Cpp_Runner.enableWarnings": true,
  "C_Cpp_Runner.warningsAsError": false,
  "C_Cpp_Runner.compilerArgs": [],
  "C_Cpp_Runner.linkerArgs": [],
  "C_Cpp_Runner.includePaths": [],
  "C_Cpp_Runner.includeSearch": [
    "*",
    "**/*"
  ],
  "C_Cpp_Runner.excludeSearch": [
    "**/build",
    "**/build/**",
    "**/.*",
    "**/.*/**",
    "**/.vscode",
    "**/.vscode/**"
  ],
  "C_Cpp_Runner.useAddressSanitizer": false,
  "C_Cpp_Runner.useUndefinedSanitizer": false,
  "C_Cpp_Runner.useLeakSanitizer": false,
  "C_Cpp_Runner.showCompilationTime": false,
  "C_Cpp_Runner.useLinkTimeOptimization": false,
  "C_Cpp_Runner.msvcSecureNoWarnings": false
}
```

`tasks.json`
```json
{
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: gcc.exe 生成活动文件",
            "command": "D:/mingw/bin/g++.exe",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            "options": {
                "cwd": "D:/mingw/bin"
                // "cwd": "${fileDirname}"：有时候"cwd"的值为："${fileDirname}"
            },
            "problemMatcher": [
                "$gcc"
            ],
            "group": {
                "kind": "build",
                "isDefault": true
            },
            "detail": "调试器生成的任务。"
        }
    ],
    "version": "2.0.0"
}
```

&emsp; 不同电脑的具体`mingw`文件位置不一样，得自己改











