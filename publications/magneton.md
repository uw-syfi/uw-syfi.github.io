---
layout: publication
title: "Magneton: Optimizing Energy Efficiency of ML Systems via Differential Energy Debugging"
authors: ["Yi Pan", "Wenbo Qian", "Dedong Xie", "Ruiyan Hu", "Yigong Hu", "Baris Kasikci"]
venue: "arXiv preprint (2025)"
year: 2025
topics: ["Energy Efficiency", "ML Systems"]
pdf: "https://syfi.cs.washington.edu/publications/magneton"
tldr: "Magneton is a differential energy profiler designed to detect and diagnose invisible inefficiencies in ML systems."
keywords:
  - Energy Efficiency
  - ML Systems
  - Differential Energy Profiling
---

We are witnessing an explosion in the resource intensity of machine learning (ML). Training a model like GPT-4 consumes an estimated 50 GWh of electricity, and generating a single response from Llama3-405B can use as much energy as lighting a 60W lamp for a minute.

While the community has poured effort into optimizing hardware—tuning GPU frequencies or power-capping—we noticed a massive, overlooked source of inefficiency: **software energy waste**. This occurs when poor software design or redundant operations consume excess energy without improving performance.

In our latest work, we present **Magneton**, a differential energy profiler designed to detect and diagnose these invisible inefficiencies.

## The Blind Spot: Performance $\neq$ Energy Efficiency

Why hasn't this been solved by standard performance profilers? The answer lies in a counter-intuitive observation we made: **energy waste does not always look like a performance issue**.

For example, we found that while PyTorch and JAX perform `float32` matrix multiplications at nearly the same speed for small matrices, PyTorch’s implementation consumes **1.45x** more energy. A performance profiler would see these two operations as identical, completely missing the wasted energy.

Furthermore, existing energy profilers like Zeus are often too coarse, requiring measurement windows (e.g., 100ms) that are far too slow to catch inefficiencies happening at the operator level (milliseconds). We realized that to fix software energy waste, we needed a new approach.

## Our Solution: Differential Energy Debugging

![(a) Summary of popular machine learning repositories grouped by category. (b)(c)(d) Energy consumption of different ML systems.](/assets/img/publications/magneton/insights_comparison.png)

We built Magneton based on a simple insight: today's ML ecosystem is diverse. For almost any task (like LLM inference), there are multiple competing systems (vLLM, SGLang, Hugging Face) performing the **same mathematical computations**.

If System A consumes significantly more energy than System B to do the exact same job, that difference is a signal. Magneton leverages this by comparing these systems to automatically pinpoint waste—a technique we call **differential energy debugging**.

### How Magneton Works

![Overview of Magneton](/assets/img/publications/magneton/overview.png)

1.  **Operator-Level Granularity:** We track energy at the level of individual operators (like a specific convolution or matrix multiplication). This is high-level enough to be consistent across different software but low-level enough to be actionable.
2.  **Semantic Equivalence:** We cannot simply compare source code because implementations vary wildly (100k+ lines of code). Instead, we analyze the **computational graph**. If two subgraphs take semantically equivalent inputs and produce equivalent outputs, we treat them as comparable.
3.  **Root-Cause Diagnosis:** Once we spot a discrepancy, Magneton uses static analysis to find the "deviation point"—the specific variable or configuration flag that caused the inefficient kernel to be selected.

## What We Found: Hidden Waste in Popular Systems

To evaluate Magneton, we applied it to 9 widely used ML systems, including PyTorch, TensorFlow, vLLM, and Stable Diffusion. The results confirmed our suspicions:

* **Significant Discoveries:** We successfully detected and diagnosed **16 known cases** of energy inefficiency and uncovered **8 previously unknown cases**, 7 of which have already been confirmed by developers.
* **Real-World Impact:** Fixing the issues identified by Magneton resulted in an average energy reduction of **13.6%**.

### Examples of What Magneton Uncovered

* **The "Silent" API Misuse:** In Hugging Face Transformers, we found that for a specific linear layer, using the `torch.addmm` API was 10% less energy-efficient than using separate `add` and `matmul` kernels, despite performance being nearly identical.
* **Stable Diffusion Misconfiguration:** We discovered that the default configuration in Stable Diffusion disabled TensorFloat-32 (TF32) operations. Simply flipping this flag—identified by Magneton—reduced end-to-end energy consumption by **12.5%**.
* **Redundant Operations:** In PyTorch's distributed training, we found that the `dist.Join` feature forces GPUs to perform useless synchronization work rather than idling when workloads are imbalanced, wasting roughly 23% more energy compared to a manual early-exit strategy.

## Conclusion

As ML models grow larger, we cannot rely solely on hardware improvements to keep energy costs in check. Our work with Magneton demonstrates that **software choices matter**. By leveraging the diversity of the ML ecosystem to cross-check and debug energy usage, we can build systems that are not just high-performing, but sustainably designed.
