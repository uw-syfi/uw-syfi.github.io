---
speaker: Jeff Mogul
affiliation: Google
title: Managing and Securing Google's Fleet of Multi-Node Servers
date: '2026-05-08'
homepage: http://jmogul.com/jeff.html
---

## Abstract

Server designs have become increasingly complicated, with a single "machine" encompassing many nodes, including special-purpose accelerators such as GPUs, Smart NICs, etc. This complexity, together with novel security threats and requirements created by multi-tenancy, makes securing these servers even harder than in the past. Similarly, server complexity leads to complexity in management-plane software. Trying to cope with server hardware complexity by writing increasingly-elaborate software leads to immense toil for software engineers, and to fragile systems that are not actually secure or reliable. Instead, we constrain the designs of complex servers by structuring them as a connected set of arenas. An arena is a collection of compute nodes, a controller node that can fully manage those resources, and a root of trust that can verify the controller node's integrity. The arena abstraction simplifies modular composition of servers, and by separating concerns, simplifies reasoning about a server as a whole, thereby simplifying machine-management software and processes. The abstraction also forms a consistent basis for addressing security threats against the integrity of the platform. We can compose a small kit of arena designs into a large variety of server designs, without suffering from the worst aspects of "SKU proliferation," The arena abstraction, combined with explicit structural models as a representation, allows us to automate many aspects of management plane software. (This talk is based on our paper in CACM: https://cacm.acm.org/research/managing-and-securing-googles-fleet-of-multi-node-servers/)

## Speaker Bio

Jeff Mogul works on fast, cheap, reliable, and flexible networking infrastructure for Google. Until 2013, he was a Fellow at HP Labs, doing research primarily on computer networks and operating systems issues for enterprise and cloud computer systems; previously, he worked at the DEC/Compaq Western Research Lab. He received his PhD from Stanford in 1986, an MS from Stanford in 1980, and an SB from MIT in 1979. He is an ACM Fellow. Jeff is the author or co-author of several Internet Standards; he contributed extensively to the HTTP/1.1 specification. He has been the chair or co-chair of a variety of conferences and workshops, including SIGCOMM, OSDI, NSDI, USENIX, HotOS, and ANCS. You can find a partial list of publications at http://research.google.com/pubs/JeffreyMogul.html
