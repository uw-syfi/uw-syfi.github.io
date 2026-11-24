---
speaker: Jinwoo Jeong
affiliation: Korea University
homepage: https://jinujeong.github.io/
title: "Efficient AI Model Serving beyond GPU Memory Constraints"
date: '2026-10-30'
---

## Abstract

Modern AI systems increasingly face GPU memory constraints as models grow larger and workloads become more complex. These constraints introduce significant challenges in efficiently serving diverse AI workloads, including multi-model and multi-turn LLM serving.

In this talk, I will present system-level resource management techniques for efficient AI model serving beyond GPU memory constraints. First, I will introduce DeepPlan, which accelerates model loading for multi-model serving of small DNNs through direct host memory access and parallel data transmission. Next, I will present FlashGen, which improves multi-turn LLM serving through multi-level KV caching and memory-aware request scheduling. Together, these techniques enable more efficient utilization of GPU and host memory resources while reducing serving overhead.

Finally, I will discuss ongoing research directions toward efficient agentic AI systems, focusing on memory management and task-level scheduling to improve resource utilization and execution efficiency.

## Speaker Bio

Jinwoo Jeong is a final-year Ph.D. candidate in Electrical and Computer Engineering at Korea University, advised by Prof. Jeongseob Ahn. His research focuses on designing efficient computer systems for AI, with an emphasis on AI model serving. In particular, he explores system-level resource management techniques to overcome GPU memory constraints and improve serving efficiency. His work has been published at top-tier systems conferences, including ASPLOS and EuroSys, and has received the Best Artifact Award at EuroSys. He is broadly interested in building scalable and resource-efficient AI systems by effectively utilizing modern hardware architectures.
