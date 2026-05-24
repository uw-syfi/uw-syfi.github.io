---
speaker: Lequn Chen
affiliation: Perplexity
title: RDMA P2P Communication Patterns for KvCache Transfer, Weight Update, and MoE
  Routing
date: '2025-11-21'
---

## Abstract

As Large Language Models (LLMs) scale and Mixture-of-Experts (MoE) architectures gain prominence, inter-node communication becomes increasingly critical. Current LLM systems rely heavily on collective communication patterns through APIs like torch.distributed and NCCL, following a Single Program Multiple Data (SPMD) model that imposes unnecessary constraints on peer-to-peer data movement. This talk revisits RDMA-based peer-to-peer communication patterns for modern LLM workloads. While peer-to-peer communication is well-established, it has been largely overlooked in contemporary LLM systems. We examine RDMA primitives and present our communication library API design through three critical use cases: (1) KvCache transfer for disaggregated inference, (2) weight transfer between training and inference nodes during RL rollouts, and (3) MoE dispatch-combine all-to-all kernels.

## Speaker Bio

Lequn graduated PhD from UW inn 2024. Lequn is currently a Research Engineer at Perplexity AI, building a better answer engine.
