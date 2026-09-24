---
layout: post
title: "Introducing ServingStudio: An Integrated Workbench for Simulating, Analyzing, and Optimizing LLM Serving Systems"
date: 2026-09-24
author: "Kan Zhu, Michael Gu, Sheetal Sriram, Keisuke Kamahori, Vic Li, Mathew Jacob, Dedong Xie, Stephanie Wang, Arvind Krishnamurthy, Baris Kasikci"
excerpt: "ServingStudio's Simulator predicts LLM serving performance and analyzes execution costs from measured GPU kernel timings. Its Agent uses these results to implement promising changes in real serving frameworks and validate them on hardware."
tags: [research, inference, agents]
---

![ServingStudio combines a Simulator and an Agent for modeling, analyzing, and optimizing LLM serving systems.](/assets/img/blog/2026-09-24-introducing-servingstudio/overview.png)

## Overview

LLM inference has become one of the most important computational workloads for both enterprises and individuals. Beyond powering end-user applications, it also plays a critical role in LLM training workflows, including reinforcement learning and synthetic data generation. Achieving good LLM serving performance depends on how hardware, model architecture, kernels, and scheduling policies work together. As models and workloads change, engineers must revisit their configuration choices and optimize their implementations. This involves identifying bottlenecks, modifying serving frameworks, and benchmarking the results—a process that takes time, manual effort, and GPU resources.

Agents can automate profiling and optimization, but without system-level performance models, they lack end-to-end performance predictions for prioritizing candidate changes. Hardware experiments also remain slow and costly to run. Simulators can make configuration exploration faster and cheaper by reusing profiling data. However, extending existing simulators to new models and interpreting their results still require cumbersome manual work, including model implementation, kernel profiling, and roofline analysis.

To help bring performance optimization into the agentic era, we present ServingStudio, an integrated workbench for simulating, analyzing, and optimizing LLM serving systems. The ServingStudio Agent extends the Simulator when new modeling support is needed. ServingStudio Sim then predicts performance and analyzes execution costs using measured GPU kernel timings. The Agent uses these results to select promising changes, implement them in real serving frameworks, and validate their effects on hardware. Users can let the Agent carry out this workflow autonomously, monitor its progress, and contribute knowledge or redirect the investigation when useful.

## A Simulator to Predict. An Agent to Act.

ServingStudio Sim provides five main capabilities:

- **Flexible configurations.** The Simulator supports diverse model families, including the GLM-5.2 series, across different quantization formats and parallel configurations. It also models serving features such as prefix caching, speculative decoding, prefill-decode disaggregation, and attention-FFN disaggregation.
- **Fast exploration.** Implemented in Rust, the Simulator runs up to 2,770× faster than real time, allowing users to explore days of serving behavior in minutes.
- **Accurate predictions.** We calibrate and validate the Simulator’s predictions against measurements from SGLang and vLLM.
- **Full observability.** Users can inspect the entire run, individual requests, scheduler iterations, and kernel execution.
- **Optimization insights.** The analysis compares simulated GPU time with a theoretical lower bound derived from the model’s computation and data movement. It breaks down the gap to identify optimization opportunities in kernels, fusion, batching, load balance, and communication, as well as redundant work and idle time.

To help the Agent investigate performance and implement changes, we provide a library of skills covering:

- Kernel discovery and profiling
- Simulator development
- Alignment with real serving frameworks
- Experiment design
- Performance analysis
- Serving-system optimization

## From Real Measurement to Real Improvement

ServingStudio provides an end-to-end workflow for optimizing LLM serving.

1. **Understand the workload.** The user defines the model, request distribution, hardware, parallelism strategy, and performance objective. The Agent measures a baseline in a framework that already supports the model, using an alternative if support is missing from the target framework.
2. **Prepare and explore in simulation.** When needed, the Agent adds the target model and serving features to the Simulator and profiles the required kernels. It aligns baseline predictions with measurements from the baseline framework, then models and evaluates candidate changes in simulation. It uses the predicted performance and execution-cost analysis to select a promising change or respect human preferences.
3. **Build with the Agent.** The Agent implements the selected change, from a kernel optimization to support for a new model, in a real serving framework.
4. **Profile the change.** The Agent captures a GPU trace to inspect kernel timings, communication, synchronization, host overhead, and idle gaps in the modified implementation.
5. **Align the result with simulation.** The Agent compares the Simulator’s predicted performance with measurements from the modified framework and investigates any discrepancies.
6. **Validate on real hardware.** The Agent checks correctness and benchmarks the modified framework against the baseline. It uses the results to accept the change or plan another iteration.

## Performance Gains in Practice

The following cases show how we used ServingStudio to improve serving performance on real hardware.

### Case 1: Extending SGLang's MoE Autotuning

During Agent-guided alignment, comparing SGLang’s measurements with the Simulator’s predictions showed that prefill MoE kernels were slower than expected. Autotuning did not cover the exact kernel called inside prefill CUDA graphs. We instructed the Agent to add a tuning pass for that path and tested GLM-5.2 NVFP4 on four B200 GPUs with four-way tensor parallelism (TP4). The benchmark used 240 requests, each with 4,096 input tokens and 8 output tokens, at concurrency 24. Input throughput improved by **5.6%** over unmodified SGLang. [PR](https://github.com/sgl-project/sglang/pull/38560)

### Case 2: Restoring CUDA Graph Replay in vLLM

During alignment, the Agent reported unexpected CPU overhead in vLLM’s multi-token prediction (MTP) execution. For GLM-5.2 NVFP4 on four B200 GPUs with TP4 and four-way expert parallelism (EP4), CPU bubbles took up to 18.5% of the end-to-end run time. We then prompted the Agent to investigate where the gap was coming from. The Agent found that, with five draft tokens, each verification step processes six tokens per request, and vLLM’s V1 runner restricted piecewise graph sizes to multiples of six. This forced 2,048-token prefill batches to run eagerly, adding CPU overhead from individual kernel launches. Raising both the scheduler budget and graph limit to 2,052 tokens restored replay. In a separate 100-request benchmark, the updated configuration achieved **10.8%** higher output throughput than the original 2,048-token configuration.

### Case 3: Building a Qwen3-235B Path in Mini-SGLang

Mini-SGLang did not support Qwen3-235B, so we used the Agent to build an FP8 implementation starting from Mini-SGLang. Guided by simulation and kernel analysis, the Agent simplified execution and fused kernels. We compared the implementation with vLLM on the same prefill-heavy workload: 256 requests at concurrency 32, with both engines running on four H200 GPUs using TP4 and EP4. The implementation delivered **25.6% higher output throughput than vLLM**.

## How ServingStudio Can Be Used

- **Students and new practitioners** can use existing profiling data to explore how model and parallelism choices affect latency and throughput without a multi-GPU setup.
- **Researchers** can ask the Agent to compare serving configurations for their workloads and explain the resulting trade-offs without writing simulation or profiling code.
- **Serving-system experts** can use ServingStudio to automate repetitive profiling and cost attribution, focusing their expertise on diagnosing bottlenecks and designing optimizations.
- **Hardware teams** can use performance predictions to guide hardware selection and new hardware design.
- **Model architects** can estimate how choices in attention, expert routing, precision, and decoding affect serving performance while the architecture is still evolving.

## What Comes Next

We plan to:

- **Support newer models**, including GLM-5.3 Flash, DeepSeek V4.1 Flash, and Kimi K3, along with the new execution patterns and serving configurations they require.
- **Model distributed prefix caches**, including cache offloading across GPU memory, host memory, and remote storage. This will help users weigh the computation saved through cache reuse against the cost of moving and storing cached data.
- **Enable remote hardware profiling** to collect measurements from a broader range of hardware. We also plan to release a public kernel-performance database so others can use these measurements for simulation and research.

## Conclusion

ServingStudio Sim helps engineers explore optimization ideas faster in simulation. ServingStudio Agent then implements promising changes and validates their effects on real hardware.

Explore ServingStudio on [GitHub](https://github.com/SyFI-ServingStudio/ServingStudio) and read the [project overview](https://syfi-servingstudio.github.io/ServingStudioIntro/).
