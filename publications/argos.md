---
layout: publication
title: "Argos: Detecting Dynamic Anomalies in the Cloud with Rule Generation
authors: ["Yile Gu", "Hoang Doan Nguyen", "Demirhan Celik", "Sifat Hasan", "Yifan Xiong", "Jonathan Mace", "Yuting Jiang", "Yigong Hu", "Baris Kasikci", "Peng Cheng"]
venue: "arXiv preprint (2025)"
year: 2025
topics: ["Agents", "Cloud Reliability"]
pdf: "https://arxiv.org/pdf/2501.14170"
tldr: "Argos is an agentic system that leverages Large Language Models (LLMs) to automatically generate and refine explainable, reproducible Python rules for detecting dynamic cloud anomalies."
keywords:
  - Cloud Reliability
  - Anomaly Detection
  - LLM Agents
  - AIOps
---

## Overview

Cloud systems are inherently dynamic, with evolving services, metrics, and workloads making anomaly detection a significant challenge. While Deep Learning (DL) methods achieve high accuracy, they often operate as "black boxes," lacking the explainability engineers need to verify alerts. Conversely, recent LLM-based methods that directly analyze time-series data suffer from stochasticity, failing to provide the reproducibility required for production deployment.

Argos bridges this gap by using LLMs not for direct detection, but to generate structured anomaly detection rules. By treating interpretable Python rules as the core abstraction, Argos delivers the accuracy of modern AI with the reliability of traditional rule-based systems.

### The Challenge: Dynamic Anomalies

In cloud infrastructure, anomaly patterns vary significantly across metrics and workloads. For example, a flatline in CPU utilization might be a disaster for a data analytics pipeline but entirely normal for a GPU training job waiting on I/O.

Engineers typically trust manual rules (e.g., "If CPU > 90% for 5 mins") because they are deterministic and easy to debug. However, writing these rules for thousands of evolving metrics is impossible to scale. Argos automates this process, creating rules that satisfy two critical requirements:

 1. **Explainability**: Structured logic that engineers can understand and verify.
 2. **Reproducibility**: Consistent outputs for identical inputs, enabling reliable debugging.


## Core Innovations

![Argos Overview](https://raw.githubusercontent.com/microsoft/argos/figs/figs/design_v11.pdf)

### Decoupling Training from Deployment
Unlike previous LLM approaches that prompt models during inference (which is slow and inconsistent), Argos uses LLMs only during a "training" phase. The LLM generates Python code to detect anomalies, which is then deployed as a lightweight function. This ensures that the online detection process is fast, deterministic, and free of LLM hallucinations.

### Agent-Based Training Loop
Generating semantic rules for complex time-series data is difficult. Argos employs an iterative **Agent-Based Training Loop** that mimics the way engineers write code:

1. **Rule Proposer**: Analyzes data chunks and proposes a Python function to label anomalies.

2. **Syntax Checker**: Executes the code on dummy data to identify and fix syntax errors.

3. **Rule Validator**: Compares the rule's performance against validation data. If accuracy drops, it feeds the diff and error cases back to the LLM to refine the logic.

### Breaking Local Optima with Mutation
To prevent the system from getting stuck in local optima (overfitting to specific patterns), Argos introduces a Rule Mutator. Periodically, this component introduces radical changes—such as removing a rule condition or altering a threshold—to force the system to explore a broader search space.

## Evaluation

Argos was evaluated against state-of-the-art DL-based methods (e.g., FCVAE, Anomaly Transformer) and LLM-based methods (e.g., LLMAD) on public datasets (KPI, Yahoo, SpotLight) and a massive internal Microsoft dataset.

### Superior Accuracy and Efficiency
Argos consistently outperforms baselines. On the internal Microsoft dataset, it improved the F1 score by 29.3% over the best baseline. Because the final output is optimized Python code rather than a heavy neural network, Argos achieves inference speedups ranging from 1.5x to 34.2x.

| Dataset | Argos F1 Score | Improvement over SOTA | Inference Speedup |
|---------|----------------|------------------------|------------------|
| KPI     | 0.897          | +9.5%                  | 3.0x             |
| Yahoo   | 0.810          | +4.8%                  | 34.2x            |
| SpotLight | 0.547          | +5.2%                  | 26.9x            |
| Internal | 0.936          | +29.3%                 | 1.5x             |


### Ablation Study: Syntax Checker and Rule Validator are Critical

![Ablation Study](https://raw.githubusercontent.com/microsoft/argos/figs/figs/evaluation_correctness_accuracy_v2.pdf)

To validate the agentic workflow, the authors compared the full Argos system against a simple "Detection Only" baseline (using just the Rule Proposer without the feedback loop). The results confirm that iterative feedback is critical for success:

- **100% Correctness**: While the simple baseline produced code with syntax errors ~7% of the time, the full pipeline with the Syntax Checker achieved a 100% correctness rate.
- **Massive Accuracy Gains**: The iterative review process was game-changing for semantic accuracy. It boosted the average F1 score by 3.8x on the KPI dataset and 11.3x on the Yahoo dataset compared to the single-pass approach.

## Key Takeaways

1. **Code as the Interface**: By generating executable Python code, Argos makes AI-driven anomaly detection transparent. Engineers can read the generated comments and logic to understand exactly why an alert fired.

2. **Cost-Effective Training**: The agentic training process is efficient. Training rules for a dataset using GPT-4o costs approximately $11, making it a viable solution for large-scale production environments.

3. **Next Steps**: The team plans to explore applying key insight behind Argos of rule synthesis and evaluation to other domains where explainability is critical.