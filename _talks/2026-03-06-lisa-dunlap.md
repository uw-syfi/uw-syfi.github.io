---
speaker: Lisa Dunlap
affiliation: UC Berkeley
title: 'Evaluation beyond benchmarks: Understanding what models do, why they fail,
  and what users want'
date: '2026-03-06'
homepage: https://lisabdunlap.com/
---

## Abstract

Benchmarks have driven remarkable progress in AI, but they are becoming an increasingly small piece of the evaluation puzzle. As generative models get deployed at scale for open-ended tasks, the bottleneck has shifted: the hard problem is no longer capability, it's understanding what our models are doing, where they fail, and whether the signals we optimize actually reflect what users want. In this talk, I will walk through my work in building more comprehensive evaluation systems through monitoring the data that flows in and out of models. I'll first show how many evaluation problems reduce to a simple primitive: comparing two sets of model inputs or outputs to surface what distinguishes them. I'll then cover Chatbot Arena, a live benchmark we built to evaluate models on open-ended, subjective tasks through real user preferences, and the problems we uncovered in doing so, including that preference signals are far noisier and more style-dependent than they appear. Along the way, we surface some surprising findings: that certain text-to-image models associate strong emotions with flames, that Arena users tend to prefer less safe responses, and that every LLM has its own distinct drunk personality. Lastly, I will touch on how these insights can close the training loop to build self-improving systems, and what oversight looks like as humans become an increasingly small part of model development

## Speaker Bio

Lisa Dunlap is a PhD student at UC Berkeley advised by Joey Gonzalez in Sky Computing Lab and Trevor Darrel in Berkeley Artificial Intelligence Lab. Her work focuses on building automated evaluations for generative models by analyzing unstructured data at scale. Previously, she was a core contributor to Chatbot Arena (now LMArena), a platform for crowdsourced performance evaluation of generative models, and Ray Tune (now Anyscale), a distributed hyperparameter tuning framework. Her work has recieved oral awards at conferences like CVPR and her work is the recipient of the Laude SlingShot grant.
