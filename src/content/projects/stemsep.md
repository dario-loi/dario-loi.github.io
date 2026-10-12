---
title: "StemSep"
description: "A web app that splits an audio file into stems (vocals, drums, bass, guitar, and the rest) with Demucs."
date: 2025-04-05
context: "Open source, Apache 2.0"
tags: ["Python", "Audio", "Gradio"]
featured: true
links:
  - { label: "Code", href: "https://github.com/dario-loi/stemsep", icon: code }
  - { label: "Docker image", href: "https://hub.docker.com/r/darioloi/stemsep", icon: download }
cover: ./stemsep.webp
coverAlt: "The StemSep web interface: an input panel above waveform players, one for each separated stem."
---

StemSep separates an uploaded audio file into vocals, drums, bass, guitar, and other stems with Demucs's `htdemucs_6s` model, behind a Gradio interface. Each stem comes back as its own track.

It runs from a Docker image with one command, with or without GPU acceleration, or locally from the repository with pip.
