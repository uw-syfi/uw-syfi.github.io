---
layout: publication
title: "DynaFlow: Programmable Intra-Device Parallelism for ML Systems"
authors: ["Yi Pan", "Yile Gu", "Jinbin Luo", "Yibo Wu", "Ziren Wang", "Hongtao Zhang", "Ziyi Xu", "Shengkai Lin", "Stephanie Wang", "Baris Kasikci"]
venue: "arXiv preprint (2025)"
year: 2025
topics: ["ML Systems"]
pdf: "https://syfi.cs.washington.edu/publications/dynaflow"
tldr: "DynaFlow is a programmable intra-device parallelism framework for ML systems that achieves high performance and low effort."
keywords:
  - ML Systems
  - Intra-Device Parallelism
  - Programmable Execution
---

As machine learning models—especially Large Language Models (LLMs)—grow exponentially in scale, they are becoming increasingly heterogeneous. A single inference request isn't just one big matrix multiplication anymore; it is a complex sequence of compute-bound, memory-bound, and network-bound operations.

This shift creates a massive inefficiency. While your GPU is busy waiting for a network operation (like an all-reduce in distributed training) to finish, its compute units often sit idle. To fix this, researchers have proposed **intra-device parallelism**—strategies like overlapping communication with computation, fusing kernels, or splitting batches.

But there is a catch: implementing these strategies is an engineering nightmare. Integrating a technique like dual-batch overlap into SGLang recently took developers over two months and 1,300 lines of invasive code changes. Worse, the best strategy changes depending on your hardware and workload, meaning you might need to rewrite that code for every new scenario.

We built **DynaFlow** to solve this. It is a new framework that makes integrating these complex parallel strategies transparent, flexible, and efficient.

## The Conflict: Static Frameworks vs. Dynamic Execution

The root of the problem is a "programming model mismatch". Frameworks like PyTorch and vLLM assume a static, sequential execution order. They execute Operator A, wait for it to finish on the GPU, and then execute Operator B.

Intra-device parallelism breaks this rule. It wants to run Operator A (compute) and Operator B (network) at the same time. To force this behavior into existing frameworks, developers have to tear apart the model code, manually managing CUDA streams and memory buffers.

## The Solution: Decoupling Schedule from Logic

Our key insight with DynaFlow is to **decouple the execution schedule from the model definition**.

Instead of hard-coding parallelism into the model, DynaFlow sits between the model and the hardware. It allows developers to keep their model code clean and sequential while defining a separate "execution schedule" that rearranges how operators run on the GPU.

### How DynaFlow Works

![Overview of DynaFlow](/assets/img/publications/dynaflow/overview.png)

1.  **Flexible Frontend:** We provide a Python-native API that lets you "program" the GPU's schedule. You can partition the model graph using simple annotations (like `SplitModule`) and then write a short Python function to control execution.
    * *Example:* You can write a 20-line scheduler to implement DBO that dynamically checks if the batch size is large enough to benefit from splitting.
2.  **Efficient Backend:** The backend handles the dirty work. It manages the asynchronous control flow and, crucially, performs **custom memory management**. One of the biggest killers of parallelism is the overhead of copying memory when splitting batches. DynaFlow analyzes the data flow ahead of time and pre-allocates memory to eliminate these copy overheads.
3.  **Compatibility:** It plays nicely with existing optimizations. You don't have to choose between DynaFlow and TorchInductor or CUDA Graphs; we support applying these optimizations at the subgraph level.

## Results: High Performance, Low Effort

We put DynaFlow to the test by integrating four different parallelism strategies (including NanoFlow and TokenWeave) into three state-of-the-art systems: vLLM, SGLang, and Hugging Face Transformers.

**The Performance Wins:**
* We achieved up to a **1.29x throughput improvement** over baseline systems.
* Our DynaFlow implementations matched or even beat (up to 1.1x) the performance of native, hand-optimized implementations of these strategies.

**The Engineering Wins:**
* **vLLM Integration:** Implementing NanoFlow in vLLM required only **75 lines of code** changes to the core system with DynaFlow.
* **Transformers:** We integrated advanced parallelism into Hugging Face Transformers without changing a single line of the model code or the library's core.

## Why This Matters

As models get bigger and hardware gets more complex, we cannot afford to leave performance on the table. Nor can we afford to spend months re-engineering our systems for every new optimization technique.

DynaFlow proves that we can have it both ways: the high performance of hand-tuned parallelism and the flexibility of high-level programming.

# Future Work

The expressive frontend of DynaFlow has even more potential. We are working on adding more advanced features by using it, such as:
- A unified interface for different parallelism (including intra-device and inter-device parallelism)
- Making DynaFlow a plugin for any existing LLM serving framework
