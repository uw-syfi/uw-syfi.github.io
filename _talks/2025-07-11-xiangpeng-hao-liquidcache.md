---
speaker: Xiangpeng Hao
affiliation: University of Wisconsin Madison
title: LiquidCache, a novel pushdown-based disaggregated caching system
date: '2025-07-11'
---

## Abstract

We present LiquidCache, a novel pushdown-based disaggregated caching system that evaluates filters on cache servers before transmitting data to compute nodes, which addresses our key observation that data decoding, not filter evaluation, is the primary bottleneck by transcoding Parquet data into a lightweight, cache-exclusive "Liquid" format that is co-designed with filter evaluation semantics to enable selective decoding, late filter materialization, and encoding-aware filter evaluation for low decoding costs and high compression ratios, allowing easy adoption without breaking ecosystem compatibility and demonstrating through integration with Apache DataFusion and evaluation with ClickBench and TPC-H that it reduces cache CPU time by up to 10× without increasing memory footprint and cuts network traffic by two orders of magnitude compared to non-pushdown systems.

## Speaker Bio

Xiangpeng Hao is a fifth year PhD student at UW-Madison adviced by Andrea Arpaci-Dusseau and Remzi Arpaci-Dusseau. His research focuses on building large scale analytical data systems. Notably, his PhD is supported by industry funding he independently raised through the LiquidCache project.
