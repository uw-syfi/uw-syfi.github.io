---
speaker: Xiaochuan Li
affiliation: Carnegie Mellon University
homepage: https://xiaochuanli.com/
title: "Scaling with Storage: Memory-Aware Training and Inference for Large Language Models"
date: '2026-11-20'
---

## Abstract

Training and serving language models are increasingly constrained by the memory system. On one hand, agents repeatedly read the same real-world sources, such as web pages, documents and tool outputs, yet each rebuilds its own expensive KV cache from scratch. On the other hand, the capacity of MoE models keeps outgrowing accelerator memory. The conventional response treats both as systems problems: fit more KV cache or more resident expert parameters into ever-larger GPU memory. In this talk, I will present our recent efforts toward model training and inference co-designed with the modern memory hierarchy. First, I will discuss an attention mechanism designed for agentic settings, in which tool results are encoded independently of the surrounding context. Removing this context dependency lifts the key barrier to KV-cache reuse, so the cache for each source can be compiled once offline and reused across arbitrary contexts. Second, I will introduce a hardware-native, prefetchable MoE architecture in which hash-based routing determines each token’s experts before computation begins. This allows the vast majority of expert parameters to reside on SSD without stalling inference. I will conclude by discussing how this perspective opens a path toward scaling model capacity and inference efficiency with cheap storage rather than expensive GPU memory.

## Speaker Bio

Xiaochuan Li is a second-year Ph.D. student at the Language Technologies Institute, Carnegie Mellon University, advised by Professor Chenyan Xiong. His research aims to build capable agents for long-horizon, open-ended tasks, spanning agent reasoning and evaluation, test-time scaling, and model architectures co-designed with modern memory systems. Previously, he interned with the Qwen post-training team at Alibaba and worked with Professor Tao Yu on computer-use agents at The University of Hong Kong. He received his B.Eng. in Software Engineering from Tsinghua University.
