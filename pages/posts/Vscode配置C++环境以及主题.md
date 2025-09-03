---
layout: post
title: Vscode配置C++环境以及主题
date: 2024-09-26 11:06:44
updated: 2025-08-24
time_warning: true
cover: 
top: 
tags: 
  - C++
categories: 其他
# author: @Remsait
---

## 前言
&emsp; 很早以前配置过VScode上的C++环境，这次换电脑用新的方法重新配置一遍  
&emsp; PS：单纯想用VScode运行C++代码来做点题

<!-- more -->

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
                "${workspaceFolder}/**",
                "F:/MinGW/include/*"
            ],
            "defines": [
                "_DEBUG",
                "UNICODE",
                "_UNICODE"
            ],
            "compilerPath": "F:/MinGW/bin/gcc.exe",
            "cStandard": "c11",
            "cppStandard": "c++17",
            "intelliSenseMode": "gcc-x64"
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
            "name": "(gdb) Launch",
            "type": "cppdbg",
            "request": "launch",
            "targetArchitecture": "x86",
            "program": "${fileDirname}/${fileBasenameNoExtension}.exe",
            "miDebuggerPath": "F:/MinGW/bin/gdb.exe",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "externalConsole": true,
            "preLaunchTask": "g++"
        }
    ]
}
```
`setting.json`
```json
{
    "files.associations": {
        "ostream": "cpp",
        "iostream": "cpp",
        "array": "cpp",
        "atomic": "cpp",
        "bitset": "cpp",
        "cctype": "cpp",
        "cfenv": "cpp",
        "charconv": "cpp",
        "chrono": "cpp",
        "cinttypes": "cpp",
        "clocale": "cpp",
        "cmath": "cpp",
        "codecvt": "cpp",
        "complex": "cpp",
        "condition_variable": "cpp",
        "csetjmp": "cpp",
        "csignal": "cpp",
        "cstdarg": "cpp",
        "cstddef": "cpp",
        "cstdint": "cpp",
        "cstdio": "cpp",
        "cstdlib": "cpp",
        "cstring": "cpp",
        "ctime": "cpp",
        "cuchar": "cpp",
        "cwchar": "cpp",
        "cwctype": "cpp",
        "deque": "cpp",
        "forward_list": "cpp",
        "list": "cpp",
        "unordered_map": "cpp",
        "unordered_set": "cpp",
        "vector": "cpp",
        "exception": "cpp",
        "algorithm": "cpp",
        "functional": "cpp",
        "iterator": "cpp",
        "map": "cpp",
        "memory": "cpp",
        "memory_resource": "cpp",
        "numeric": "cpp",
        "optional": "cpp",
        "random": "cpp",
        "ratio": "cpp",
        "regex": "cpp",
        "set": "cpp",
        "string": "cpp",
        "string_view": "cpp",
        "system_error": "cpp",
        "tuple": "cpp",
        "type_traits": "cpp",
        "utility": "cpp",
        "fstream": "cpp",
        "future": "cpp",
        "initializer_list": "cpp",
        "iomanip": "cpp",
        "iosfwd": "cpp",
        "istream": "cpp",
        "limits": "cpp",
        "mutex": "cpp",
        "new": "cpp",
        "scoped_allocator": "cpp",
        "shared_mutex": "cpp",
        "sstream": "cpp",
        "stdexcept": "cpp",
        "streambuf": "cpp",
        "thread": "cpp",
        "typeindex": "cpp",
        "typeinfo": "cpp",
        "valarray": "cpp"
    },
    
    "editor.formatOnSave": true,
    "[cpp]": {
        "editor.defaultFormatter": "ms-vscode.cpptools"
    },
    "C_Cpp.formatting": "vcFormat",
    "clang-format.style": "Google"
}
```

`tasks.json`
```json
{
    "version": "2.0.0",
    "command": "g++",
    "type": "shell",
    "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": false,
        "panel": "shared",
        "showReuseMessage": true,
        "clear": false
    },
    "args": [
        "-m32",
        "-g",
        "${file}",
        "-o",
        "${fileDirname}/${fileBasenameNoExtension}.exe"
    ],
    "problemMatcher": {
        "owner": "cpp",
        "fileLocation": [
            "relative",
            "${workspaceRoot}"
        ],
        "pattern": {
            "regexp": "^(.*):(\\d+):(\\d+):\\s+(warning|error):\\s+(.*)$",
            "file": 1,
            "line": 2,
            "column": 3,
            "severity": 4,
            "message": 5
        }
    },
    "tasks": [
        {
            "type": "cppbuild",
            "label": "C/C++: gcc.exe 生成活动文件",
            "command": "F:/MinGW/bin/g++.exe",
            "args": [
                "-fdiagnostics-color=always",
                "-g",
                "${file}",
                "-o",
                "${fileDirname}\\${fileBasenameNoExtension}.exe"
            ],
            "options": {
                "cwd": "F:/MinGW/bin"
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
    ]
}
```

&emsp; 不同电脑的具体`mingw`文件位置不一样，得自己改




## doki-Theme
先在扩展里面下载 doki-Theme  
然后 ctrl + shift + p  
搜索 doki theme   
下载 chocola's wallpaper  
主题选用 Franxx: zero two light lily  






