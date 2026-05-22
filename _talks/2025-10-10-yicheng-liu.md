---
speaker: Yicheng Liu
affiliation: UCLA
title: 'SOSP practice talk: Yicheng Liu (UCLA)'
date: '2025-10-10'
---

## Abstract

Modern software inevitably encounters periods of resource overload, during which it must still sustain high servicelevel objective (SLO) attainment while minimizing request loss. However, achieving this balance is challenging due to subtle and unpredictable internal resource contention among concurrently executing requests. Traditional overload control mechanisms, which rely on global signals, such as queuing delays, fail to handle application resource overload effectively because they cannot accurately predict which requests will monopolize critical resources. In this paper, we propose Atropos, an overload control framework that proactively cancels the culprit request that cause severe resource contention rather than the victim requests that are blocked by it. Atropos continuously monitors the resource usage of executing requests, identifies the requests contributing most significantly to resource overload, and selectively cancels them. We integrate Atropos into six large-scale applications and evaluate it against 16 real-world overload scenarios. Our results show that Atropos maintains the performance goals while achieving minimal request drop, significantly outperforming state-of-the-art solutions.

## Speaker Bio

Yicheng is a second-year Ph.D. student at UCLA, co-advised by Sam Kumar and Harry Xu. Yicheng was an undergraduate student at Shanghai Jiao Tong University (SJTU). When Yicheng was an undergraduate student at SJTU, Yicheng was an intern at Institution of Parallel And Distributed System (IPADS), advised by Jinyu Gu. In the 2024 Summer, Yicheng was an intern in University of Washington, System Group, advised by Baris Kaciksi and mentored by Yigong Hu. In the 2023 Summer, Yicheng visited and took part in the research in University of Michigan, OrderLab, advised by Ryan Huang.
