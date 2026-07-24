---
layout: post
title: "Breaking Down Bash Commands in TraceLab"
date: 2026-07-24
author: "Kan Zhu, Mathew Jacob, Chenxi Ma, Yi Pan, Stephanie Wang, Arvind Krishnamurthy, Baris Kasikci"
excerpt: "TraceLab V2 looks inside coding agents' Bash calls, comparing which executables Claude and Codex invoke and where those commands spend their time."
tags: [research, inference, agents]
---

## Overview

In our prior release of TraceLab, we showed that **Bash commands are the most frequently used tool calls** for both Claude and Codex, accounting for 56.9% of overall tool invocations and 56.6% of total tool time. However, Bash commands vary widely in the underlying binaries they invoke. In this post, we take a closer look at Bash commands and analyze per-executable popularity and latency distributions.

We parse the raw inputs of Bash commands from TraceLab's normalized traces. We then use a Bash parser to split each command into individual invocations, breaking common one-liner patterns such as `&&` and `|` into separate executables. Overall, we parsed 158,610 Bash calls from Claude and 264,670 from Codex, yielding 891,000 and 404,797 executable invocations, respectively. For Claude, 84.2% of Bash calls are one-liners with multiple executables, with each command containing 5.62 executables on average. For Codex, 28.7% of Bash calls contain multiple executables, with an average of 1.53 executables per command.

## Executable Popularity

In terms of popularity, both Claude and Codex spend a significant portion of their calls on file operations. Notably, **Claude tends to prefer `grep`, `head`, and `tail`, while Codex more frequently uses `sed` and `rg`**. Beyond these "trivial" operations, Claude and Codex spend around 3.6% and 5.9% of their calls on Git operations, while Python code execution accounts for 3.7% and 10.0% of their calls, respectively.

![Most popular shell executables for Claude and Codex](/assets/img/blog/2026-07-24-tracelab-bash/executable-popularity.png)

## Latency Distributions

For the runtime analysis, we consider only Bash commands that invoke a single executable. Codex imposes a default timeout of approximately one second; commands that exceed this limit continue running in the background, and Codex polls their status through subsequent `write_stdin` calls. To measure the full runtime, we follow each initial invocation through its final `write_stdin` call and report the resulting end-to-end execution time. As expected, common utilities such as `ls` and `grep` finish quickly. By contrast, tools such as `uv`, `conda`, and `python` show substantially greater runtime variability, with some executions lasting several minutes.

![Runtime distributions for shell executables](/assets/img/blog/2026-07-24-tracelab-bash/executable-runtime.png)

## Cumulative Runtime

When we aggregate execution time by tool, `python` stands out for both systems. For Claude, `python` accounts for only 3.7% of executable invocations but more than half of the total observed execution time. For Codex, Python scripts represent 10.0% of invocations yet contribute 35.7% of the total runtime.

![Shell executables with the highest summed completion time](/assets/img/blog/2026-07-24-tracelab-bash/executable-total-runtime.png)

## TraceLab V2

The first version of TraceLab did not include detailed Bash command executions. TraceLab V2 expands the dataset and adds this executable information to support the broader research community. Check out our [new release](https://github.com/uw-syfi/TraceLab/releases/tag/v0.0.2) and [live demo](https://tracelab.cs.washington.edu/).
