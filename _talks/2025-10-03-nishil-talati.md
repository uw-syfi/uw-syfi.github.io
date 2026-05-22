---
speaker: Nishil Talati
affiliation: UIUC
title: 'MoDM: Mixture of Diffusion Models to Navigate the Performance-Quality Trade-off
  in Image Generation'
date: '2025-10-03'
---

## Abstract

Diffusion-based text-to-image generation models trade latency for quality: small models are fast but generate lower quality images, while large models produce better images but are slow. In this talk, I will present our recent work MoDM, a novel image caching-based serving system for diffusion models that dynamically balances latency and quality through a mixture of diffusion models. The key enabler of this idea is the concept of image cache that allows a consistently high image generation quality at a high performance. This design enables adaptive serving by dynamicallybalancing latency and image quality: using smaller models for cache-hit requests to reduce latency while reserving larger models for cache-miss requests to maintain quality. Small model image quality is preserved using retrieved cached images. MoDM is agnostic to any model or model family, showing effectiveness across Flux, Stable Diffusion, and SANA. Towards the end of this talk, I will present important lessons I learned while doing this research.

## Speaker Bio

Nishil Talati is an Assistant Research Scientist in the CSE department at the University of Michigan and an incoming Assistant Professor in the CS department at University of Illinois, Urbana-Champaign (UIUC). His research focuses on computer architecture and systems software design to enhance the efficiency of generative AI and data analytics applications. Nishil's work has been featured in leading venues including ISCA, MICRO, HPCA, ASPLOS and VLDB, and has been recognized with several awards including Research Faculty Recognition Award, IEEE computing's top 30 early career professional award, HPCA best paper award and honorable best paper mentions at DATE 2023, IISWC 2023, and recognition as a 2023 ProQuest Distinguished Dissertation Award Finalist.
