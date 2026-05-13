---
layout: publication
title: "TeleRAG: Efficient Retrieval-Augmented Generation Inference with Lookahead Retrieval"
authors: ["Chien-Yu Lin", "Keisuke Kamahori", "Yiyu Liu", "Xiaoxiang Shi", "Madhav Kashyap", "Yile Gu", "Rulin Shao", "Zihao Ye", "Kan Zhu", "Stephanie Wang", "Arvind Krishnamurthy", "Rohan Kadekodi", "Luis Ceze", "Baris Kasikci"]
venue: "arXiv preprint"
year: 2025
topics: ["LLM Serving", "RAG"]
pdf: "https://arxiv.org/pdf/2502.20969"
code: "https://github.com/efeslab/TeleRAG"
tldr: "TeleRAG is an efficient RAG inference system that reduces latency and improves throughput using lookahead retrieval to prefetch data from CPU to GPU in parallel with LLM generation."
keywords:
  - Retrieval-Augmented Generation
  - Lookahead Retrieval
  - Inference Serving
  - GPU Memory Optimization
  - Intra-Device Parallelism
---

## Overview

TeleRAG is a high-performance inference system designed to optimize Retrieval-Augmented Generation (RAG) pipelines. Unlike traditional RAG systems where retrieval and generation are executed sequentially, often leading to high latency and resource underutilization, TeleRAG introduces **lookahead retrieval** to overlap these processes. By predicting and prefetching required data from CPU to GPU memory in parallel with LLM decoding, TeleRAG significantly reduces end-to-end latency and maximizes throughput, especially in memory-constrained environments.

## Core Innovations

![TeleRAG main idea](/assets/img/publications/telerag/design.png)

### 🚀 Lookahead Retrieval

The central innovation of TeleRAG is its ability to anticipate future data needs:

- **Prefetching Mechanism**: Predicts the next required retrieval clusters and transfers them from CPU to GPU memory while the GPU is busy generating the current tokens.
- **Pipeline Overlapping**: Hides the latency of data transfer and retrieval by executing them simultaneously with the compute-intensive generation phase.

### ⚡ Efficient Scheduling

TeleRAG employs advanced scheduling strategies to handle complex RAG workloads:

- **Prefetching Scheduler**: Groups similar queries in batched inference to maximize the utility of prefetched data and reduce redundant transfers.
- **Cache-Aware Scheduler**: Optimizes multi-GPU setups by routing queries to the GPU that already holds the relevant cached data, minimizing inter-device communication.
- **Hybrid Search**: Combines lookahead prefetching with on-demand CPU search to guarantee retrieval accuracy without stalling the pipeline.

### 🔧 Resource Optimization

- Enables running large-scale RAG pipelines (e.g., Llama-3 8B with a 61GB datastore) on a single commodity GPU (e.g., RTX 4090 24GB).
- Minimizes GPU memory footprint by keeping the full datastore on CPU/SSD and only transferring relevant clusters on-the-fly.

## Performance Benchmarks

TeleRAG consistently outperforms state-of-the-art RAG serving systems:

| Metric | Improvement |
|--------|-------------|
| **Single-Query Latency** | **1.53x reduction** |
| **Batched Throughput** | **1.83x increase** |

### Tested Configurations
- **Model**: Llama-3 8B / 3B
- **Datastore**: Wikipedia (61 GB)
- **Hardware**: Single NVIDIA RTX 4090 (24 GB)
- **Baselines**: Standard CPU-based retrieval + GPU generation pipelines

### Key Results
- **1.53x lower latency** for single queries by hiding retrieval overhead.
- **1.83x higher throughput** in batched scenarios due to efficient scheduling.
- Successfully serves benchmarks like Natural Questions, HotpotQA, and TriviaQA with minimal GPU memory usage.

## System Architecture

TeleRAG's architecture is built to bridge the speed gap between retrieval and generation:

1. **Lookahead Retriever**: A lightweight module that predicts future retrieval needs based on the current context.
2. **Asynchronous Data Mover**: Manages the transfer of inverted file (IVF) clusters from host memory to GPU memory in the background.
3. **Dual-Path Execution**:
   - **Path A (GPU)**: LLM generation proceeds without interruption.
   - **Path B (CPU/PCIe)**: Retrieval indices are fetched and prepared for the next step.

This design eliminates the "stop-and-wait" nature of conventional RAG, creating a smooth, continuous flow of data and computation.

## Key Takeaways

**RAG inference is often bound by retrieval latency and memory bandwidth**, not just compute. Traditional systems stall the GPU while waiting for data from slow storage or CPU memory.

**Lookahead prefetching unlocks hidden parallelism in RAG**. By treating retrieval as a predictable, pre-fetchable operation, TeleRAG keeps the GPU fed and busy, transforming a sequential bottleneck into a parallel efficiency gain. This approach is essential for deploying powerful RAG applications on resource-constrained edge devices or cost-effective cloud instances.