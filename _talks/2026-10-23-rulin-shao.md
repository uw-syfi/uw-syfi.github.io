---
speaker: Rulin Shao
affiliation: University of Washington
homepage: https://rulinshao.github.io/
title: Context Language Models
date: '2026-10-23'
---

## Abstract

In this talk, I will present our recent work on Context Language Models (CLMs) and share my proposal on model-native systems.

CLMs are language models that natively manage their own context. By treating context as a file that the model can freely edit, CLMs learn what information to retain, revise, or discard as they work. This approach naturally extends to multi-agent systems, where agents’ contexts coexist as files. Across deep research, long-horizon coding, and multi-agent tasks, CLMs improve performance while reducing computational cost compared with existing context-management strategies. Moving context management from external harnesses into model behavior also enables models to learn better strategies through both in-context optimization and reinforcement learning. Complementing these capabilities, we introduce Suffix Cache Reuse, a serving optimization that further reduces reprefilling cost in CLM serving.

I will conclude with a broader vision for model-native systems. Agents understand what their jobs are trying to accomplish, which can help systems optimize execution. Systems, in turn, can expose their current state so agents can adapt their policies to changing execution conditions. We envision interfaces that support this two-way exchange, opening up a broader space for joint optimization. I will outline several potential research directions and welcome feedback and opportunities to collaborate.

## Speaker Bio

Rulin Shao is a fourth-year PhD student at the University of Washington, advised by Prof. Pang Wei Koh and Prof. Luke Zettlemoyer. During her PhD, she has worked closely with Scott Yih and Mike Lewis at Meta. She completed her master's in Machine Learning at CMU, advised by Prof. Eric Xing, and her undergraduate degree in Mathematics at XJTU. Her research focuses on building AI systems that can automatically collect information from diverse sources, conduct deliberate practice, and decide how to spend time, compute, and storage to handle complex tasks.
