---
layout: post
title: "Let AI Agents Write Your Serving Stack with VibeServe"
date: 2026-05-12
author: "Keisuke Kamahori, Shihang Vic Li, Simon Peter, Baris Kasikci"
excerpt: "We present VibeServe, a multi-agent system that synthesizes a complete LLM serving runtime end-to-end, specialized to a user-specified model, hardware, and workload."
---

**TL;DR**
Traditionally, computer systems have been built with a one-size-fits-all approach, in which a single generic system is designed and optimized to serve a variety of use cases. LLM serving systems are no exception: major systems like vLLM and SGLang support a wide range of models, hardware backends, and optimization techniques within a single codebase. While they achieve impressive performance for mainstream use cases, there are always *long-tail* scenarios, as new model architectures, hardware accelerators, and application workloads continue to emerge day by day.

We argue that, with the rise of coding agents, a different design choice may now be possible -- instead of maintaining one generic system, we can generate many *bespoke* systems whenever a new use case appears. In this spirit, we designed **VibeServe**, a multi-agent system that synthesizes a complete serving runtime end-to-end, specialized to a user-specified model, hardware, and workload. Testing VibeServe across six different case studies, we found:

- on a standard case study where existing systems are heavily optimized (Llama-3.1-8B on H100 GPU), the VibeServe-generated system achieved performance comparable to vLLM and SGLang, showing that agents can match human-engineered systems and that generation-time specialization does not need to compromise performance.
- on non-standard case studies, where we picked model architectures, workload patterns, and hardware that are niche yet realistic and benefit from specialized optimizations, VibeServe was able to generate systems that achieve 1.69×–6.27× speedup.

This is one of the first pieces of evidence that **AI agents can build an entire system end-to-end, complete long-horizon performance-optimization tasks, and beat human-engineered systems in a meaningful way**.

- preprint: [https://arxiv.org/abs/2605.06068](https://arxiv.org/abs/2605.06068)
- code: [github.com/uw-syfi/vibe-serve](https://github.com/uw-syfi/vibe-serve).

---

![Generic serving today vs. VibeServe's approach.](/assets/img/blog/2026-05-12-introducing-vibeserve/idea.png)

***Figure 1.** Generic serving today (left) covers every (workload, model) pair across hardware with a single general-purpose framework. VibeServe (right) instead uses an outer/inner agentic loop to generate one bespoke serving system per (workload, model, hardware) target.*

The tradeoff between generic and specialized systems is a recurring tension in computer systems research. Generic runtimes amortize engineering effort across many use cases but pay a *portability tax* — abstractions designed to fit every target rarely fit any target perfectly. Several lines of OS work pushed hard in the other direction: the [*Synthesis* kernel](https://dl.acm.org/doi/10.1145/74850.74869) specialized kernel code paths per call site at runtime; [*exokernels*](https://dl.acm.org/doi/10.1145/224056.224076) stripped resource management out of the kernel and let applications drive hardware decisions themselves; [*unikernels*](https://dl.acm.org/doi/10.1145/2451116.2451167) compiled the application and only the OS libraries it needed into a single specialized image. Although the performance gains were real, the per-target engineering cost has historically made generic systems the more practical choice: building and maintaining a bespoke system for every workload simply did not pencil out.

LLM serving sits at the same crossroads today, but with a sharper version of the long tail. Today's open-source serving stacks (vLLM, SGLang, TensorRT-LLM) are impressive engineering achievements, but each is a single runtime stretched to cover every model, accelerator, and workload. Their designs are shaped by mainstream deployments, such as decoder-only Transformers on NVIDIA GPUs serving generic chatbots. Anything off this beaten path either runs slowly or does not run at all.

To see what mainstream stacks are missing, look at the long tail along the three axes that have historically driven serving-system effort — model architecture, workload, and hardware — and that even today remain out of reach for generic runtimes.

- **Model architectures.** Many new model architectures challenge the common abstractions in serving systems and sometimes require building new systems from scratch. Multimodal models are a clear example, with bespoke systems built for different modalities (e.g., [vLLM-Omni](https://arxiv.org/abs/2602.02204), [VoxServe](https://arxiv.org/abs/2602.00269)).
- **Workload patterns.** Workload-specific signals admit optimizations that a workload-agnostic runtime cannot assume. For example, [prefix caching](https://arxiv.org/abs/2411.19379) for hybrid models needs policies aware of in-place recurrent updates; some applications allow [predicted-output-based speculative decoding](https://fireworks.ai/blog/cursor) for a significant speedup; and [streaming speech models](https://huggingface.co/UsefulSensors/moonshine-streaming-medium) need special care for efficient deployment.
- **Hardware.** Apple Silicon's unified-memory model breaks CUDA-centric assumptions, other accelerators (e.g., AMD GPUs, Google TPUs, Amazon Trainium) each have their own kernel ecosystem, and custom inference accelerators bring their own constraints.

Closing this gap requires moving specialization from build time to generation time — generating a serving runtime per deployment rather than retrofitting a general-purpose one. We call this approach **VibeServe** (Figure 1).

## Why end-to-end synthesis is hard

Coding agents change the cost calculus that historically kept per-target specialization unattractive: agentic loops have been shown effective on isolated components such as [GPU kernels](https://arxiv.org/abs/2502.10517), [individual algorithms](https://deepmind.google/blog/alphaevolve-a-gemini-powered-coding-agent-for-designing-advanced-algorithms/), [systems policies](https://arxiv.org/abs/2510.06189), and [fault diagnosis](https://www.sigops.org/2026/the-long-game-how-agents-that-remember-resolve-operational-issues-faster/).

Pushing those loops up to a complete serving runtime, however, is a substantially harder regime. The artifact under construction spans request scheduling, KV-cache management, batching, kernel selection, and an HTTP-facing front end. It exceeds any single agent's context window. The standard recourse, context compaction, induces drift in correctness and performance over long horizons. Evolutionary search sidesteps drift through populations of scored programs, but a scalar score cannot encode the planning state that an end-to-end system requires. Existing multi-agent loops carry richer state across roles but typically do not reset agent contexts, inheriting the same compaction limitations. Long-horizon harnesses, in published reports, tend to produce systems that are buggy and slower than state-of-the-art baselines.

VibeServe is our attempt to build an agentic loop that produces serving systems that are correct, competitive on mainstream deployments, and substantially faster on long-tail ones.

## VibeServe approach: two loops, fresh contexts, persistent state

![VibeServe architecture.](/assets/img/blog/2026-05-12-introducing-vibeserve/architecture.png)

***Figure 2.** VibeServe architecture. User-provided artifacts (model, hardware, workload) on the left define the target. An outer planning loop tracks search state across git checkpoints and dispatches a single round to an inner loop, where an Implementer, Accuracy Judge, and Performance Evaluator collaborate over a shared workspace with access to a skills library and an execution environment. The output, on the right, is a complete bespoke serving system.*

At a high level (Figure 2), VibeServe takes three user-provided artifacts — model (weights and a reference implementation), hardware target, and workload (a benchmark and a correctness checker) — and synthesizes a bespoke serving system, one per (model, hardware, workload) target. The output is a complete runtime: API server, scheduler, KV-cache, model code, backend, plus tests and benchmarks. The framework operates on two nested optimization loops, backed by persistent search state, a skills library that encodes serving-systems knowledge, and an execution environment in which candidates are built and measured. Both loops keep their state outside any agent's context window, so neither suffers compaction drift.

**Outer loop: a search policy over validated checkpoints.** The outer loop is a *search policy* that maintains persistent planning state — a backlog of structured **issues**, a long-term Markdown **memory** file, and a git history of validated checkpoints — and uses it to pick the next optimization direction and dispatch a concrete task to the inner loop. Every accepted candidate is a git commit, so the loop can revert cheaply when a later round passes correctness but regresses on the headline metric. The issue backlog, filed by inner-loop agents through a Model Context Protocol server, captures candidate optimization directions. The memory file, read on entry and edited at the end of each round, lets the orchestrator distinguish "this implementation needs debugging" from "this direction is genuinely unsuitable for the workload." This separation matters: a loop that conflates the two will repeatedly chase failed attempts, or equally damagingly, discard promising directions after a single buggy implementation. (For a complementary take on persistent memory paying off across long-horizon agentic work, see [The Long Game](https://www.sigops.org/2026/the-long-game-how-agents-that-remember-resolve-operational-issues-faster/) on SIGOPS.)

**Inner loop: three specialized agents on a shared workspace.** Within each round, three coding agents collaborate on a shared workspace in fresh contexts:

- The **Implementer** writes and edits the candidate serving system.
- The **Accuracy Judge** validates correctness against the user-provided reference implementation and inspects the diff for reward-hacking patterns — prompt-keyed completion caches, schema-only synthesis, fast paths that bypass model inference.
- The **Performance Evaluator** profiles validated implementations with platform-specific tools (Nsight Systems, the PyTorch profiler) and feeds bottleneck insights back to the outer-loop policy.

Only Judge-validated implementations advance, preventing incorrect designs from derailing subsequent rounds. Keeping implementation, correctness, and performance reasoning in independent contexts is deliberate: a combined agent can quietly weaken its correctness criteria to land a hard optimization, but a fresh-context Judge that sees only the diff and runtime behavior cannot.

**Skills library: extensibility through skills, not framework edits.** Rather than hardcoding optimizations into the framework itself, VibeServe uses a dedicated [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) library distilled from existing serving engines and the research literature, covering techniques like continuous batching, paged-KV caching, and FlashAttention variants. Skills are organized along the abstraction layers an engineer works through when building a serving engine: model architectures, serving algorithms, programming frameworks, backend libraries, hardware platforms, reference engines, and tooling. New model families, accelerators, and optimization techniques enter the system as new skill entries rather than core framework modifications, which keeps the framework itself target-agnostic. Compatibility constraints live here too: which paged-KV implementations are available on which hardware backends, where mechanisms live in vLLM or SGLang, how MLX differs from PyTorch on Apple Silicon.

## Does it work?

We evaluated VibeServe across six deployment targets spanning workload pattern, model architecture, and hardware. The Implementer, Judge, and Evaluator were each instantiated with Codex CLI; the outer loop used the issue-tracker policy described above. Each case study pairs a setting where a generic stack is suboptimal or unable to run with a VibeServe-generated implementation specialized for the model, hardware, and workload.

### Case Study A: Standard LLM serving (Llama-3.1-8B on H100)
![Case Study A: Llama-3.1-8B-Instruct on H100.](/assets/img/blog/2026-05-12-introducing-vibeserve/exp/llama_8b_h100.png)
***Figure 3.** Case Study A: token throughput, TTFT, and TPOT of the VibeServe-generated system relative to vLLM over 60 iterations on Llama-3.1-8B-Instruct (H100); each line is one of four request rates (8, 32, 64, 128 req/s) the agent introduced as it plateaued. The horizontal line at 1.0 is parity with vLLM, higher is better.*

A natural first question when considering per-deployment specialization is whether it incurs a performance penalty. To test this, we ran VibeServe on [Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) with an NVIDIA H100, a highly optimized mainstream setup. Across 60 iterations, VibeServe's generated runtime matched vLLM and SGLang on token throughput, time-to-first-token (TTFT), and time-per-output-token (TPOT) (Figure 3). The agent prioritized throughput, achieving parity with vLLM around iteration 30, then shifted focus to reducing latency, further improving TTFT and TPOT throughout iterations 30–60.

### Case Study B-F: non-standard scenarios

We then probed the long tail along the three axes that historically drive serving-system effort — **model architecture**, **workload pattern**, and **hardware**. Each of the five non-standard case studies stresses at least one of these axes (tagged with `#model`, `#workload`, `#hardware` below), so that together they cover the dimensions on which generic stacks tend to break down. Figure 4 summarizes the per-iteration trajectories; the per-case sections that follow give the details.

<div style="overflow-x: auto; padding-bottom: 8px;">
<div style="display: flex; gap: 16px; min-width: max-content;">

<figure style="flex: 0 0 360px; margin: 0;">
<img src="/assets/img/blog/2026-05-12-introducing-vibeserve/exp/qwen_32b_code_edit.png" alt="Case B" style="width: 100%;" />
<figcaption>(a) <b>Case B.</b> Code editing — <b>5.95×</b> vs vLLM</figcaption>
</figure>

<figure style="flex: 0 0 360px; margin: 0;">
<img src="/assets/img/blog/2026-05-12-introducing-vibeserve/exp/olmo_hybrid_prompt_cache.png" alt="Case C" style="width: 100%;" />
<figcaption>(b) <b>Case C.</b> Hybrid prompt cache — <b>3.45×</b> vs vLLM</figcaption>
</figure>

<figure style="flex: 0 0 360px; margin: 0;">
<img src="/assets/img/blog/2026-05-12-introducing-vibeserve/exp/moonshine.png" alt="Case D" style="width: 100%;" />
<figcaption>(c) <b>Case D.</b> Streaming ASR — <b>1.69×</b> vs vLLM plugin</figcaption>
</figure>

<figure style="flex: 0 0 360px; margin: 0;">
<img src="/assets/img/blog/2026-05-12-introducing-vibeserve/exp/spec+cons_decoding_mbp.png" alt="Case E" style="width: 100%;" />
<figcaption>(d) <b>Case E.</b> Local JSON decode — <b>2.6×</b> vs autoregressive</figcaption>
</figure>

<figure style="flex: 0 0 360px; margin: 0;">
<img src="/assets/img/blog/2026-05-12-introducing-vibeserve/exp/show_o2_h100.png" alt="Case F (H100)" style="width: 100%;" />
<figcaption>(e) <b>Case F (H100).</b> Show-o2 — <b>21.4%</b> lower p50</figcaption>
</figure>

<figure style="flex: 0 0 360px; margin: 0;">
<img src="/assets/img/blog/2026-05-12-introducing-vibeserve/exp/show_o2_mbp.png" alt="Case F (MBP)" style="width: 100%;" />
<figcaption>(f) <b>Case F (MBP).</b> Show-o2 — <b>6.27×</b> vs PyTorch-MPS</figcaption>
</figure>

</div>
</div>

***Figure 4.** Per-iteration speedup/latency trajectories for the five non-standard case studies B–F, with subpanels (a)–(f) above. Dashed line at 1.0 is parity with the baseline; higher is better, except for (e) Case F (H100) where the y-axis is p50 latency in ms and lower is better. Each plot tracks the VibeServe iteration that produced the candidate; details are in the per-case sections below.*

<details markdown="1">
<summary><h3 style="display: inline; margin: 0;">Case Study B: Code editing with predicted outputs (Qwen3-32B on H100)</h3></summary>

`#workload`

Some applications can tell the serving system, at request time, roughly what the answer will look like. A serving system that exposes a *predicted-output* interface can turn that hint into a large latency win. Code editing is the canonical example. When a user asks the model to fix a bug or rename a symbol, the edited file is usually the original file with small, localized changes. The pre-edit file is therefore a [near-perfect prediction of the output](https://fireworks.ai/blog/cursor), and [OpenAI's predicted-outputs API](https://platform.openai.com/docs/guides/predicted-outputs) exposes this interface, allowing the client to pass predicted text alongside the prompt. Under the hood, this is a special form of speculative decoding in which the draft is free: there is no draft model, only user-supplied tokens. The engine can run a window of K predicted tokens through the target model in a single forward pass, accept the longest matching prefix, and fall back to one-token autoregressive decoding at the first mismatch. When overlap is high, latency can drop by nearly a factor of K with no extra model compute.

Generic serving stacks support draft-model speculative decoding, but they do not expose predicted outputs as a first-class interface. Adding that support is not just an API change. It cuts across the scheduler, sequence-group state, and sampler: the engine needs a per-request predicted-token stream, a verifier loop that advances through that stream until divergence, and precise fallback semantics after a mismatch. A bespoke runtime can instead make predicted outputs part of the request lifecycle from the beginning.

We tried VibeServe at [Qwen3-32B](https://huggingface.co/Qwen/Qwen3-32B) on H100 with that interface and the [CodeEditorBench](https://arxiv.org/abs/2404.03543) workload (Figure 4(a)). Iteration 2 added CUDA-graph capture (1.35×). By iteration 3, it had a working predicted-output verifier that proposed tokens from the user-supplied prediction in 16-token blocks and verified them in a single target-model forward pass, reaching 2.9× — already on par with vLLM's draft-model speculative decoder at zero draft-model compute. By iteration 14, with tuned block sizing and acceptance bookkeeping, the generated system reached **5.95×** over vanilla vLLM and roughly **2×** over vLLM with draft-model speculative decoding.

</details>

<details markdown="1">
<summary><h3 style="display: inline; margin: 0;">Case Study C: Hybrid-architecture prompt caching (Olmo-Hybrid-7B on L4)</h3></summary>

`#model` `#workload`

A growing number of recent models interleave self-attention layers with state-space-model (SSM) or linear-attention layers for smaller KV cache capacity. A pure attention model carries a KV cache that grows linearly in sequence length, which becomes the dominant cost in long-context serving, while SSM/linear-attention layers compress the entire past into a fixed-size tensor. Replacing some attention layers with SSM layers can cut KV-cache capacity dramatically while preserving quality. But the same property that saves memory complicates *prefix caching*. In a pure-attention model, caching a shared prefix means caching that prefix's KV entries token-by-token; multiple requests can read from the same per-token cache. SSM state, by contrast, is not per-token: each layer holds a single recurrent state that summarizes the *entire* history up to the current step, updated in place. To reuse a long shared prefix across requests, a serving system therefore has to snapshot the SSM state at the prefix boundary for every request, in addition to the per-token attention KV blocks. On a GPU with limited memory facing long contexts, those per-request SSM snapshots can themselves be large enough to crowd out other tenants, and getting the cache invariants wrong silently corrupts outputs. Knowing the workload at system design time changes the picture: if the system is told up front that requests share a long common prefix (as in RAG or system-prompt-heavy serving), it can snapshot the SSM state *once* at that prefix boundary and amortize it across all requests, instead of paying the per-request snapshot cost a workload-agnostic runtime must assume in the worst case.

[Olmo-Hybrid-7B](https://huggingface.co/allenai/Olmo-Hybrid-7B) (Gated DeltaNet + attention) is a representative target. We ran a RAG-style workload on an NVIDIA L4 where requests share a 32k-token prefix, append a 128-token unique suffix, and generate 128 output tokens (Figure 4(b)). Iterations 1–6 failed accuracy gates while VibeServe wired up the dual cache — attention KV blocks plus per-DeltaNet recurrent-state snapshots taken at the prefix boundary. Iteration 7 landed continuous batched decode against the shared state (2.45×); iteration 9 added CUDA-graph capture (3.25×); the system plateaued near **3.45×** over vLLM, which has to recompute the 32k prefix per request because it cannot share DeltaNet state across requests.

</details>

<details markdown="1">
<summary><h3 style="display: inline; margin: 0;">Case Study D: Streaming ASR (Moonshine on L4)</h3></summary>

`#model` `#workload`

Streaming automatic speech recognition wants to start emitting transcript tokens before the user finishes talking. The classic ASR encoder–decoder design, most notably OpenAI's [Whisper](https://arxiv.org/abs/2212.04356), works against that goal: the speech encoder runs full self-attention over the entire audio segment, so every time a new audio chunk arrives, the engine has to re-encode the whole utterance from scratch. End-to-end latency grows with the length of the user's turn. New models like [Moonshine Streaming](https://huggingface.co/UsefulSensors/moonshine-streaming-medium) change the encoder side of this picture. Its speech encoder uses *sliding-window attention*, where each acoustic frame attends only to a bounded local window of previous frames. The architecture is designed so that, in principle, a serving system can keep a per-stream cache of the encoder's hidden state, append the new audio chunk, and only run the encoder over the new frames (plus the relevant window) rather than re-encoding from scratch. However, the latency win is unlocked only when the serving system actually does that incremental encoding and caches the per-stream encoder state across chunks.

That is exactly where mainstream stacks fall short. vLLM supports plugging in new model architectures, and Moonshine can be implemented as a vLLM model plugin, but the encoder path in vLLM is built around one-shot encoding for models like Whisper, with no first-class notion of per-stream encoder cache management. Adding that means touching the scheduler, the request lifecycle, and how encoder state interacts with the KV cache — well beyond what a plugin is allowed to do. A bespoke serving system can instead treat per-stream encoder caches as a first-class object and lay out its scheduler around them.

We measured TTFT at concurrency 32 on an L4 GPU, with clients sending audio chunks every 2 seconds, against a vLLM-Moonshine plugin baseline (Figure 4(c)). Iteration 5 reached a working but sub-baseline configuration (0.84×) by aligning the per-stream encoder cache with Moonshine's sliding-window attention; iteration 10 added CUDA-graph capture (1.1×); iteration 13 added a paged KV cache for per-stream encoder state, reaching **1.69×** and holding through iteration 16. The win comes from making per-stream encoder cache management first-class, which the plugin path simply does not expose.

</details>

<details markdown="1">
<summary><h3 style="display: inline; margin: 0;">Case Study E: Local constrained JSON decoding (Llama-3.1-8B on a MacBook)</h3></summary>

`#workload` `#hardware`

When an application asks the model to emit JSON conforming to a schema, a lot of the output is grammatically forced: every object key the schema declares, the surrounding `"..."` and `:` and `,` separators, and the leading characters of typed values (`true` / `false`, the opening digit of a number, the opening quote of a string) are uniquely determined by where the decoder is in the grammar. A constrained decoder that knows the schema can recognize these runs and do *jump-forward decoding* without invoking the LLM for those positions at all. Engines like [XGrammar](https://arxiv.org/abs/2411.15100) and [Outlines](https://arxiv.org/abs/2307.09702) build the schema into a pushdown automaton and pre-compute a per-state token mask so that, when the grammar admits exactly one continuation, multiple tokens can be appended in a single step at near-zero compute.

We also wanted to see whether VibeServe's approach generalizes off NVIDIA, so we ran this case study on a MacBook (Apple M3 Pro, 36 GB) on [JSONSchemaBench](https://arxiv.org/abs/2501.10868), targeting [Llama-3.1-8B-Instruct](https://huggingface.co/meta-llama/Llama-3.1-8B-Instruct) (Figure 4(d)). The hardware switch matters: Apple Silicon's unified-memory model and the [MLX](https://github.com/ml-explore/mlx) runtime have very different bandwidth and kernel-dispatch characteristics from CUDA, so optimizations that pay off on H100 may be no-ops or regressions here, and tooling like CUDA Graphs is unavailable. From a 22.1 s vanilla autoregressive baseline, VibeServe first added XGrammar-based constrained decoding (16.9 s), then layered speculative decoding with a Llama-3.2-1B-Instruct-4bit draft against the 8B-8bit target at K=4, reaching 9.3 s — a 3B-4bit draft was actually slower because the 1B's lower per-step cost outweighed its lower acceptance rate. Bumping `mlx_lm`'s `prefill_step_size` from 512 to 2048 prefilled the ~1300-token prompts in one chunk, yielding 8.6 s (**2.6×**). K/V quantization, alternative K, and `mx.compile` were tried and did not help — useful to know, and exactly the kind of dead-end search that the loop runs so a human does not have to.

</details>

<details markdown="1">
<summary><h3 style="display: inline; margin: 0;">Case Study F: Local image generation with Show-o2 (MacBook and H100)</h3></summary>

`#model` `#hardware`

[Show-o2](https://arxiv.org/abs/2506.15564) is a native unified multimodal model, where a single backbone handles both text and image generation, rather than bolting an image decoder onto a language model. Concretely, it builds on a 3D causal VAE that turns images (and video frames) into continuous latents, fuses them with text token embeddings into one sequence, and feeds that sequence through a Qwen2.5-derived Transformer body. The body then drives two output heads in the same forward pass: a language head that produces text tokens autoregressively, and a flow-matching head that denoises the image latents through K diffusion-like steps. Text generation, image generation, and text-conditioned image generation all reuse the same backbone with different head schedules.

That hybrid structure is precisely what mainstream serving stacks have no place to put. vLLM is built around the autoregressive decode loop; vLLM-Omni adds disaggregated stages for omni-modal models, but neither supports models that interleave an autoregressive language head and a multi-step flow-matching head over a shared Transformer body in one request. There is no first-class abstraction for "run the body once, then iterate the diffusion head K times against the cached body state, then sometimes re-enter the body," so neither system can run Show-o2. There is no obvious off-the-shelf baseline and the experiments below compare against the model's reference PyTorch implementation. We ran two targets:

- **H100 (Figure 4(e)).** We target the [Show-o2 1.5B-HQ](https://huggingface.co/showlab/show-o2-1.5B-HQ) checkpoint at 432×432 text-to-image. Over 20 iterations, p50 latency fell from 873 ms to 687 ms (**21.4%**). Gains were front-loaded: iteration 1 contributed 9.7% (CUDA-graph replay/prewarm, VAE/postprocess layout); iteration 2 added 5.4% (trim inactive diffusion tokens, restrict AdaLN to the active image span); iteration 6 trimmed the Qwen tail (3.1%). Later passes mostly mapped the limits — aggressive trimming and naive batching regressed quality, FlashAttention-2/GQA/`torch.compile`/fp16 altered outputs or produced NaNs, and Qwen prefix reuse yielded no gain because the text prefix is tiny next to the 730-token image span.
- **MacBook (Figure 4(f)).** VibeServe first ported the Qwen2.5-1.5B body and 10-block diffusion head to MLX and elided a redundant SigLIP pass on noisy latents (2.4×). Cross-step redundancy then dominated: prefix-KV caches on the body and head, plus a prefill trim, brought warm latency to 3.5× with the body at ~92% of fp16 compute peak. Quantization regressed on the compute-bound body; only int4 on the bandwidth-bound head survived. A classifier-free-guidance stride at K=16 — skipping the unconditional branch on K−1 of every K steps and reusing the cached `v_uncond` — reached 15.54 s, a **6.27×** speedup over PyTorch-MPS and within ~7% of a 14.5 s physics floor computed from kernel-perfect per-step times.

</details>

## Takeaways and what comes next

Across all six case studies, VibeServe matched mainstream baselines where they were strong and delivered 1.69×–6.27× speedups where they were weak or absent. What the agent converged on was rarely a wholly new technique — more often a familiar optimization implemented in a way generic stacks cannot, or a known set of techniques recomposed for a specific workload, sometimes with quite different data layouts, kernel structure, or scheduling discipline. The skills library encodes the building blocks; the agentic loop assembles and adapts them per target. As the diversity of models, accelerators, and workloads continues to outpace any single team's capacity to add code paths, this is the architecture that scales: not by writing more code, but by generating it on demand, specialized to the deployment that needs it.

We think the implication generalizes well beyond LLM serving. The same tension between generic abstraction and target-specific performance shows up across the systems stack — operating systems, networking stacks, databases, distributed runtimes, compilers — and the same historical reason (per-target engineering cost dwarfs the gain) is what kept specialization niche. If agentic loops can carry an end-to-end LLM serving system from a reference implementation to a competitive bespoke runtime, the same recipe should apply anywhere the artifact has a clear correctness oracle and a numeric performance metric. Concretely, that suggests a different way to build systems software: maintain a *target-agnostic harness* plus a *skills library* of optimization techniques, and let the agentic loop assemble a bespoke system per deployment, rather than maintaining one general-purpose runtime that has to absorb every special case.

There is plenty left to do. VibeServe today assumes a user-provided correctness checker; building strong correctness oracles is itself an open research problem, especially for systems where exact equivalence is impossible. Single-seed runs and non-trivial per-target compute budgets are limitations we want to tackle next; natural directions include *curriculum bootstrapping* (start from a simpler target and graduate to the real one) and *branching exploration* (run divergent outer-loop strategies in parallel and merge what works), both of which plug into the existing inner-loop interface. We are also excited to take the same harness-plus-skills design to other systems domains where the long tail is real and growing — and we expect that as coding agents get better at long-horizon work, generation-time specialization will start to beat runtime generality in more and more places.

If you want to try VibeServe or contribute skills for new architectures, accelerators, or workloads, the code is at [github.com/uw-syfi/vibe-serve](https://github.com/uw-syfi/vibe-serve) and the paper has the full design and per-iteration logs.

We are grateful to our collaborators at the University of Washington for the discussions and feedback that shaped this work, and to [Modal](https://modal.com/) for providing the compute credits.
