---
layout: post
title: 
description: 
summary: 
tags: notes college advice
toc: true
usemathjax: true
---

## Me and Note Taking

### First Steps

When I was in my bachelors, I liked spending (excessive) time on figuring out how best to take my notes. It started with simple pen-and-paper, but soon moved onto LaTeX. I got so good with it that I was capable of taking complex notes in real-time (resulting in a book-like document for the Operating Systems course that is still around, and can be found [here]([here](https://github.com/Sapienza-ACSAI/Systems-And-Networking-U1/blob/main/notes_dario/sys_I.pdf))). 

I was proud of my notes, but I soon realized that I was putting way more effort into configuring my note-taking system than actually taking notes, let alone taking the time to review them! This made me search for a solution that was less structured, and more focused on the content.

### Obsidian

I then started using [Obsidian](https://obsidian.md/), which yeah, is way more easy-going than LaTeX, but it also pretends to hold the universal truth about note taking. 

Lately, youtube, reddit and the internet in general have been **absolutely flooded** with video essay-like content about how obsidian will change your life, how it acts effectively as a second brain, and how it will make you a better person, and so on.

This kind of [cultish](https://en.wikipedia.org/wiki/Cargo_cult_programming) behavior is the *antithesis* of productivity, and it's unfortunately something that happens too often when a bunch of software engineers all get together around the new shiny thing. In practice, Obsidian was "forcing" me to keep my notes in the way it preferred: scattered, unstructured and hyperlinked. It gets you to follow its formula and makes you think that by doing so you're building something extraordinary when really all that is happening is that you're losing a coherent view of the material.

Don't get me wrong, Obsidian's system is sure to fit *some* use cases, but I don't believe it's the end-all be-all that current hype makes it out to be.

### My Realization

After having finished my bachelor, and being faced with challenging masters degree courses^[Like Robotics, gods know how hard that was], I realized that the best thing to do when you have to take things seriously is to *just do what you're supposed to do*. Notes are a way to remember what was taught in class that morning, or what you talked about in a meeting with your colleagues, or what scattered ideas are currently sitting in your brain as you're coding your next project.

Notes are not supposed to be pretty, they should not be a work of art! *the only person that needs his notes to be pretty is the one that is trying to sell them (or the note-taking system) to you.*

### What I Do Now

Nowadays, I just went back to pen-and-paper for maths-heavy courses, there is no solution (bar
getting an expensive tablet) that solves the problem of quick sketches as well as good old paper does, moreover, there is actual [research](https://doi.org/10.3389/fpsyg.2023.1219945) that suggests that physically writing things down helps you remember them better.

For more theoretical courses, I just use simple markdown files, I split course units in chapters (which are separate `.md` files) and then stitch them together in a LaTeX-looking PDF using `pandoc`. With a simple `Makefile` I can compile the notes in a matter of seconds, and the setup is so simple that I don't get caught up on adding magical plug-ins or themes to my note-taking system.

If you're a student like me, I suggest you take my advice, write your notes on paper, use clay tablets for all I care! but do not think that what's stopping you from achieving more in your studies is a fancier, more complex note-taking system. Rather spend more time reviewing your notes, and as little time as possible taking them. 
