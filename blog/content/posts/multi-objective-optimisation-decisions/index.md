---
title: "What multi-objective optimisation taught me about decisions"
date: 2026-10-11T08:00:00+03:00
draft: false
tags: ["decision-making", "multi-objective optimisation", "research"]
summary: "Before you rank, find the frontier. A lesson about decisions from a PhD on skyline queries."
description: "What skyline queries and Pareto frontiers teach about making decisions: stop collapsing criteria too early, and remove dominated options first."
ShowToc: false
---

My PhD was on **skyline queries**: finding the options no other option beats on every criterion at once.

The technical lesson was about algorithms. The lasting one was about decisions.

Most bad choices aren't wrong answers. They're answers to a question that was **collapsed too early**, with five criteria squeezed into one score before anyone looked at the trade-offs.

<figure class="skyline-fig">
<svg viewBox="0 0 520 330" role="img" aria-label="Skyline example: options compared on cost and risk. Options on the frontier are highlighted; dominated options are faded.">
  <defs><marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>
  <g stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7">
    <line x1="60" y1="280" x2="490" y2="280" marker-end="url(#arr)"/>
    <line x1="60" y1="280" x2="60" y2="25" marker-end="url(#arr)"/>
  </g>
  <text x="490" y="305" text-anchor="end" font-size="14" fill="currentColor" opacity="0.8">cost (lower is better)</text>
  <text x="20" y="30" font-size="14" fill="currentColor" opacity="0.8" transform="rotate(-90 20 30)" text-anchor="end">risk (lower is better)</text>
  <polyline points="95,70 150,130 220,175 320,215 440,245" fill="none" stroke="#34d399" stroke-width="2.5" stroke-dasharray="6 5"/>
  <g fill="currentColor" opacity="0.28">
    <circle cx="190" cy="95" r="8"/><circle cx="260" cy="140" r="8"/><circle cx="300" cy="100" r="8"/>
    <circle cx="350" cy="170" r="8"/><circle cx="390" cy="120" r="8"/><circle cx="420" cy="200" r="8"/>
    <circle cx="270" cy="165" r="8"/><circle cx="460" cy="160" r="8"/><circle cx="175" cy="115" r="8"/>
  </g>
  <g fill="#34d399" stroke="#0f172a" stroke-width="2">
    <circle cx="95" cy="70" r="10"/><circle cx="150" cy="130" r="10"/><circle cx="220" cy="175" r="10"/>
    <circle cx="320" cy="215" r="10"/><circle cx="440" cy="245" r="10"/>
  </g>
  <text x="335" y="262" font-size="14" fill="#34d399">the skyline (frontier)</text>
  <text x="300" y="80" font-size="14" fill="currentColor" opacity="0.6">dominated</text>
</svg>
<figcaption>Every faded option is beaten on both cost and risk by something on the frontier. Only the green options deserve a debate.</figcaption>
</figure>

The skyline doesn't tell you what to choose. **It tells you what to stop considering**: everything *dominated*, meaning options that are worse in every respect than something already on the table. That usually removes most of the options, and it makes the remaining argument honest, because every option left involves a real trade-off.

> Before you rank, find the frontier. Then decide what you're willing to give up.
