---
speaker: Jiaheng Lu
affiliation: University of Pennsylvania
homepage: https://jiahenglu.com/
title: "From Efficient Inference to Realistic Evaluation: Toward Next-Generation Web Agents"
date: '2026-11-06'
---

## Abstract

Browser agents let a language model shop, book, trade, and post on our behalf, and they are quickly moving from demos into products. Two questions decide how far they get: what is the right model for browser-agent tasks, and are we measuring agents on the right data? This talk presents one answer to each.

The first part addresses the model. Serialized web pages can span thousands of tokens, yet only a small and scattered fraction receives substantial attention when the next action is decoded. BrowSA is a training-free sparse attention method that exploits this structure, selecting relevant semantic DOM elements and computing attention over their tokens. It also reorganizes the KV cache so that the selected elements are cheap to fetch, which reduces decode latency. BrowSA matches or exceeds the task performance of dense attention while decoding 1.8x faster.

The second part addresses evaluation. Existing self-hosted web benchmarks freeze the website, so an agent is never penalized for being slow or for acting at the wrong moment. FullStackArena is a benchmark of 781 tasks across six dynamically changing full-stack web applications (stock trading, auctions, ride-hailing, maps, a social feed, and a video platform). The best current agent solves 31% of the tasks against an 84% human reference, which points to timing and latency as a largely unaddressed axis of agent capability.

I will conclude by discussing how the two parts reinforce each other: an efficient model is what lets an agent act in time, and time-aware evaluation is what tells us whether it does.

## Speaker Bio

Jiaheng Lu is a second-year PhD student at the University of Pennsylvania, advised by Vincent Liu. His research focuses on browser agents and GPU kernel agents, including efficient model architectures for browser agents, realistic browser-agent benchmarks, redesigning web systems for browser agents, and high-performance execution environments for GPU kernel agents. Previously, he worked on disaggregated memory systems.
