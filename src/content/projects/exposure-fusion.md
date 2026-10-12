---
title: "Exposure Fusion"
description: "A Python module for fast HDR image processing: it aligns a bracketed set of exposures and blends them into one well-exposed image."
date: 2022-12-12
context: "Open source, MIT"
tags: ["Computer vision", "Python", "OpenCV"]
links:
  - { label: "Code", href: "https://github.com/dario-loi/exposure-fusion", icon: code }
  - { label: "Original paper", href: "https://web.stanford.edu/class/cs231m/project-1/exposure-fusion.pdf", icon: paper }
featured: false
cover: ./exposure-fusion.webp
coverAlt: "An exposure-fused photograph of a desk at night with a laptop, a statuette, and a lit lamp."
---

An implementation of the exposure fusion algorithm, which merges photographs taken at different exposures into a single image without building an HDR radiance map first. It adds an alignment step to the original paper's method, which improves the result when the photographs in a sequence are offset from each other.

The repository has the `ExposureFusion` class, which works like a PyTorch module (create it once, then call it on a list of images), and a small Tkinter interface built on it. It started as a course project for Computer Graphics at Sapienza University of Rome.
