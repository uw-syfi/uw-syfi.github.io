---
speaker: Dimitrios Skarlatos
affiliation: Carnegie Mellon University
title: 'The Wrong Contract at Every Layer: Redesigning OS and Hardware for AI Datacenters'
date: '2026-05-15'
homepage: https://www.cs.cmu.edu/~dskarlat/
---

## Abstract

The AI datacenter stack is built on hardware-software contracts and abstractions that were never designed for the demands of the workloads they now serve. Memory systems strain under terabyte-scale capacity, heterogeneous AI accelerators have been forcefully pressed into deployment, and AI's appetite for data increasingly collides with the privacy realities that infrastructure provides today. With datacenters projected to consume over 1,000 TWh annually, renegotiating the system and hardware stack is no longer optional. In this talk, I will share my research journey redesigning these contracts and where they lead. I will start with memory management, presenting Contiguitas and Learned Virtual Memory (LVM), a progression of OS and hardware redesigns that tackle virtual memory from fragmentation in production datacenters to near-ideal address translation. I will then discuss LithOS, the first operating system for efficient ML on GPUs, giving the OS the control over heterogeneous accelerators it has so far lacked. Finally, I will briefly describe how Cinnamon and Cerium bring these threads together to make encrypted AI practical at scale. I will conclude with open questions on how AI itself can help renegotiate the hardware-software contract, and where we go from here.

## Speaker Bio

Dimitrios Skarlatos is an assistant professor in the Computer Science Department at Carnegie Mellon University. His research bridges computer architecture and operating systems with a focus on AI datacenter efficiency, privacy, and scalability. His work has been deployed in production datacenters and upstreamed into the Linux kernel. He has received the IEEE CS TCCA Young Computer Architect Award, the NSF CAREER Award, the Intel Rising Star Award, a Linux Foundation Faculty Award, an ISCA Best Paper Award, two ASPLOS Best Paper Awards, a CACM Research Highlight, four IEEE MICRO Top Picks, the joint ACM SIGARCH & IEEE CS TCCA Outstanding Dissertation Award, and over a dozen industry faculty awards from Meta, Intel, Amazon, Oracle, AMD, and VMware. His recent work led to the founding of LithosAI, a startup where he serves as the CEO.
