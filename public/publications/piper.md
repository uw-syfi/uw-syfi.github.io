---
tldr: Piper is a PyTorch library for training large models with flexible pipeline parallel schedules. 
keywords:
  - ML Compilers
  - Distributed Training
  - Pipeline Parallelism
---

## Overview

Pipeline parallelism is a key distribution technique for training large models, however it is not frequently adopted due to its implementation complexity. 
Existing state-of-the-art frameworks have adopted pipeline parallelism but fail to achieve generality in the models and execution schedules they support.
Piper is a PyTorch pipeline parallelism package that seeks to give the user full control over the execution schedule without the burden and error-proneness of low-level coordination.
Piper achieves competetive preliminary performance with state-of-the-art frameworks pipelining Llama and CLIP models.

### Pipeline-Parallel Schedules

Pipeline-parallel execution schedules describe where and when forward and backward stages execute. 
They overlap multiple batches of data to improve utilization. 
Different schedules make different tradeoffs between throughput, memory, and communication. 
For example, interleaved 1F1B partitions the model into twice as many stages compared to 1F1B and interleaves
execution between devices, enabling overlapping multiple forward-backward streams to decrease
idle time at the cost of additional peer-to-peer communication at stage boundaries.

![1F1B and Interleaved 1F1B Execution Schedules](https://raw.githubusercontent.com/uw-syfi/piper/main/figs/1f1b-schedules.png)

Due to the implementation complexity of coordinating any one schedule, existing training frameworks like Megatron-LM and DeepSpeed bake in only one or two different schedules and do not support schedule extensibility. 

## Core Innovations

### Decouple Specification from Implementation

Piper's key insight is to decouple the specification of the model and pipeline-parallel execution schedule from their distributed implementation.

![Piper Diagram](https://raw.githubusercontent.com/uw-syfi/piper/main/figs/piper.png)

- Piper partitions arbitrary PyTorch models using the TorchDynamo JIT compiler to extract computation graphs as `torch.fx` graphs, and leverages user annotations to partition the computation graphs into subgraphs for each pipeline stage.
- Piper proposes abstractions for specifying pipeline-parallel execution schedules. Currently, Piper supports reordering and interleaving microbatches.

We aim to enrich the scheduling abstractions to support schedule specifications that decompose operations within stages and overlap communication and computation operations.

### Flexible Coordination with a Single-Controller Distributed Runtime

Piper uses a single-controller distributed runtime to flexibly coordinate a high-level schedule specification.
We use Ray as an RPC layer to manage distributed workers.

![Piper Single-Controller Distributed Runtime](https://raw.githubusercontent.com/uw-syfi/piper/main/figs/controller.png)

The controller distributes computation subgraphs, model parameters and optimizer states to workers, and dispatches forward and backward tasks for each batch based on the schedule specification.
Piper uses *futures* for asynchronous execution.
A future represents a value that will eventually be computed, which lets the controller run ahead of workers scheduling tasks to hide RPC overhead.
*Remote* futures keep data on the workers to avoid materializing data on the controller.
When an output tensor is ready, it transfers directly between workers using a pluggable communication backend, like NCCL for GPU-GPU transfer.

## Performance Benchmarks

Piper achieves comparable preliminary performance with state-of-the-art distributed training frameworks.
We compare training throughput pipelining a Llama model with Megatron-LM, PyTorch's pipeline parallelism package (PiPPy), and Piper. 
Piper has 6% lower throughput than PiPPy due to RPC overhead. 
We plan to eliminate RPC overhead by exploring compiled Ray programs, which schedule communication operations ahead of time.

We also evaluate training throughput on the CLIP multi-modal model.
Megatron only supports transformer models, so we can't evaluate it on CLIP.
CLIP has image and text encoder submodules that we partition into independent pipeline stages.
PiPPy only supports sequential pipeline stages, forcing the image and text encoder stages to run sequentially. 
Piper executes these stages concurrently and achieves 19% higher training throughput.

![Training Throughput Evaluation](https://raw.githubusercontent.com/uw-syfi/piper/main/figs/eval.png)

## Key Takeaways and Future Work

**Decoupling enables extensibility**. By decoupling the specification of pipeline-parallel execution schedules from their implementation, Piper enables further improvements to the usability and flexibility of the scheduling language and distributed runtime.

**Next: Interoperability with other parallelism strategies**. Combining parallelism strategies (e.g. PPxFSDP and PPxEP) complicates communication patterns and requires carefully coordinating communication operations across strategies to avoid interference. We plan to support and explore these kinds of schedules in Piper.