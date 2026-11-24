---
speaker: Xiangyu Gao
affiliation: University of Washington
homepage: https://xiangyug.github.io/
title: "Toward Safely Optimizing eBPF Programs using Transformation Witnesses"
date: '2026-11-13'
---

## Abstract

The execution speed of eBPF programs is important because they implement many performance-critical functions. But existing eBPF optimizers are limited because they primarily operate on bytecode and make local optimizations, missing non-local optimization opportunities visible at the source-code level. We present EvolveBPF, a framework that uses AI agents for source-level eBPF optimizations. Different from the existing frameworks, it requires the AI agent to generate not only optimized eBPF programs but also transformation witnesses that capture the assumptions under which the code optimization is correct. We incorporate these witnesses into a semantic checker, enabling code optimizations to go beyond what would be possible with strict equivalence alone. Preliminary experiments using open-source benchmarks shows that our approach can speed up eBPF programs by up to 2.7×.

## Speaker Bio

Xiangyu is a postdoc at University of Washington SyFI and FOCI Lab advised by Ratul Mahajan and Arvind Krishnamurthy. His research focus is on code generation and code optimization. Concretely, he leverages AI-agents to optimize input programs and builds semantic checkers to offer correctness guarantee from the perspective of formal methods. The current work focuses on the eBPF domain. Broadly, his work draws on offloading the manual code optimization effort and improving the actual execution performance of software systems.
