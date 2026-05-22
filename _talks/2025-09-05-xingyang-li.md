---
speaker: Xingyang Li
affiliation: MIT
title: Acceleration of diffusion models
date: '2025-09-05'
---

## Abstract

Diffusion models are capable of generating photo-realistic images and videos, showing a promising future for AIGC. However inference speed, training speed and memory efficiency hinder their deployment in real world as well as their long-context ability. In this talk, I will present our recent works, RadialAttention and SVDQuant. Radial Attention identifies the Spatiotemporal Energy Decay in video diffusion models: post-softmax attention scores diminish as spatial and temporal token distance increases. Guided by this motivation, we translates this energy decay into a unified and static mask with exponentially decaying compute density, which is sub-quadratic and allows longer video generation through efficient LoRA-based fine-tuning. Radial Attention accelerates default-length video generation with quality maintained for state-of-the-art video diffusion models and allows up to 4 times longer video generation with high quality. SVDQuant targets at 4-bit diffusion models, which is challenging due to high sensitivity in both weights and activations. The method facilitates conventional smoothing techniques by using a high-precision, low-rank branch to take in the weight outliers with Singular Value Decomposition (SVD), while a low-bit quantized branch handles the residuals. Moreover, its co-designed inference engine Nunchaku fuses the low-rank branch kernels into the low-bit branch to eliminate redundant memory access. SVDQuant enables off-the-shelf W4A4 diffusion models with high fidelity and up to a 3.1 times speedup on RTX 5090 GPUs.

## Speaker Bio

Xingyang Li is a senior undergraduate at ACM Honors Class, SJTU. He is currently a student intern at MIT HAN Lab, advised by Professor Song Han. His research focuses on developing efficient algorithms and systems for deep learning, with applications in the realm of computer vision. Before starting the internship at MIT, he conducted research in algorithm-hardware co-design for vision applications like 3D Gaussian Splatting and Video Transformers, and his works were published in top-tier EDA conferences including DAC and ICCAD. He is also seeking a Ph.D. position starting in 2026 Fall.
