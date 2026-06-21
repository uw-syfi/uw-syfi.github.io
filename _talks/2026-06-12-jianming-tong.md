---
speaker: Jianming Tong
affiliation: Georgia Tech
title: Enabling ASIC AI Chips for Cryptography Primitives
date: '2026-06-12'
homepage: https://jianmingtong.github.io/
---

## Abstract

Cryptography-based applications powered a $3.5T market in 2025, yet demand for cryptographic computation already outpaces today's available compute by roughly 10x. Closing this gap will require not just more hardware, but a new way to unlock far more performance from the hardware we already have. In this talk, we will introduce CROSS [HPCA'26] and MORPH [DAC'26], which develop compiler transformations that map cryptographic workloads--homomorphic encryption (HE) for privacy-preserving AI and zero-knowledge proofs (ZKP) for cryptocurrency--onto AI ASICs (Google TPUs), achieving up-to 10x higher throughput than SoTA GPUs/FPGAs, without hardware changes. More broadly, our insight is that dedicated hardware (ASICs such as Google's TPU) shouldn't be pigeonholed by their original intent ("AI-only"), but by their computational capabilities (high-throughput matrix/vector engines and coarse-grained memory reordering). A compiler can systematically retarget non-AI domains onto these capabilities, expanding what "AI ASICs" can accelerate.

## Speaker Bio

[Jianming Tong](https://jianmingtong.github.io/) is a 5th-year PhD, Student Researcher at Google. He focuses on enabling AI system for applications beyond AI such as cryptography and using AI to improve kernels and architectures. A few representative highlights include CROSS [[HPCA'26](https://ieeexplore.ieee.org/abstract/document/11408507) w/ Google], MORPH [[DAC'26](https://arxiv.org/abs/2604.17808) w/ Google], FEATHER [[ISCA'24](https://ieeexplore.ieee.org/stamp/stamp.jsp?arnumber=10609591)], MINISA [[ISPASS'26](https://arxiv.org/abs/2603.20623)] and PRIVATAR ([MLSys'26](https://arxiv.org/abs/2604.17476)).
