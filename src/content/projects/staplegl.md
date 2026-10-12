---
title: "StapleGL"
description: "A header-only OpenGL wrapper in modern C++20 with no dependencies: buffers, shaders, textures, and framebuffers as C++ objects."
date: 2023-04-24
context: "Open source, MIT"
tags: ["C++", "OpenGL", "Graphics"]
featured: true
links:
  - { label: "Documentation", href: "https://dario-loi.github.io/staplegl/", icon: external }
  - { label: "Code", href: "https://github.com/dario-loi/staplegl", icon: code }
  - { label: "AUR package", href: "https://aur.archlinux.org/packages/staplegl-git", icon: download }
cover: ./staplegl.webp
coverAlt: "The Utah teapot rendered with StapleGL and a bloom effect, glowing over water at dusk."
---

StapleGL is a thin wrapper around OpenGL 3.3 and later that turns OpenGL objects into C++ objects with move semantics. It has no dependencies and makes no assumptions about the function loader or the windowing library, so it drops into an existing project.

It covers vertex, index, and uniform buffers, vertex arrays, textures, render buffers, framebuffers, and shader programs. On top of those it adds automatic shader parsing and compilation, an instanced vertex buffer for batch rendering, a simple interface for uploading uniforms, and STL algorithms over buffer contents. It began as a fork of Christian Panov's GLCore.
