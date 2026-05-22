---
speaker: Lakshya Agrawal
affiliation: UC Berkeley
title: GEPA and prompt optimization for compound AI systems
date: '2025-11-07'
---

## Abstract

Large language models (LLMs) are increasingly adapted to downstream tasks via reinforcement learning (RL) methods like Group Relative Policy Optimization (GRPO), which often require thousands of rollouts to learn new tasks. We argue that the interpretable nature of language often provides a much richer learning medium for LLMs, compared to policy gradients derived from sparse, scalar rewards. To test this, we introduce GEPA (Genetic-Pareto), a prompt optimizer that thoroughly incorporates natural language re-flection to learn high-level rules from trial and error. Given any AI system containing one or more LLM prompts, GEPA samples trajectories (e.g., reasoning, tool calls, and tool outputs) and reflects on them in natural language to diagnose problems, propose and test prompt updates, and combine complementary lessons from the Pareto frontier of its own attempts. As a result of GEPA's design, it can often turn even just a few rollouts into a large quality gain. Across four tasks, GEPA outperforms GRPO by 10% on average and by up to 20%, while using up to 35x fewer rollouts. GEPA also outperforms the leading prompt optimizer, MIPROv2, by over 10% (e.g., +10% accuracy on AIME-2025).

## Speaker Bio

Lakshya A Agrawal is a second-year PhD student in the Sky Lab at UC Berkeley, advised by Prof. Matei Zaharia and Prof. Dan Klein. His research tackles critical challenges in AI, focusing on sample-efficient agentic optimization and AI system reliability. He recently developed GEPA: a reflective prompt optimizer that can outperform reinforcement learning in sample-efficiency, and mmGRPO: an RL algorithm for tuning complex AI systems. His work on reliability includes contributions to MAST, the first taxonomy and study of multi-agent system failures, and the langProBe benchmark. Prior to Berkeley, Lakshya was an AI4Code research fellow at Microsoft Research, where he worked to improve the reliability of LLM-generated code through integration of static-analysis tools in LLM-code generation pipelines, and created multilspy, a leading Python client for integrating coding agents with IDE tools.
