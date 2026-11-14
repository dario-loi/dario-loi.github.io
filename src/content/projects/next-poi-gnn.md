---
title: "Next-POI recommendation"
description: "A transformer-based hierarchical graph neural network for next point-of-interest recommendation, built in PyTorch Lightning for my M.S."
date: 2024-09-18
context: "M.S. project, Sapienza University of Rome"
tags: ["PyTorch Lightning", "Graph neural networks", "Recommendation"]
cover: ./next-poi-gnn.webp
coverAlt: "The model as a diagram. Seven inputs, the last visited place, the user, and the place at five coarser levels labeled G@2 to G@6, enter an embedding layer, then a block labeled GRN with an attention box inside that also takes two small graphs, then a feed-forward layer that outputs the next place at each level."
links:
  - { label: "Code", href: "https://github.com/dario-loi/foursquare", icon: code }
  - { label: "Report", href: "https://github.com/dario-loi/foursquare/blob/master/report/report.pdf", icon: paper }
---

This M.S. project trains and tests a transformer-based hierarchical graph neural network that predicts the next point of interest a user will visit, from check-in sequences in the New York Foursquare dataset. It is written in PyTorch Lightning.

It improves on prior methods by +2.3% top-1 and +13.7% top-20 accuracy. The repository holds the end-to-end training and evaluation code and the written report.
