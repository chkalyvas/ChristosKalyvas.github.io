---
# Leave the homepage title empty to use the site title
title: ""
# Search result title and description (distinct from the blog home page)
seo:
  title: "Profile, Publications & CV | Christos Kalyvas-Kasopatidis"
summary: "Academic profile of Christos Kalyvas-Kasopatidis, PhD: AI security research, 7 publications with 170+ citations, experience, research projects, talks and CV."
date: 2022-10-24
type: landing

design:
  # Default section spacing
  spacing: "6rem"

sections:
  - block: resume-biography-3
    content:
      # Choose a user profile to display (a folder name within `content/authors/`)
      username: admin
      text: ""
      # Show a call-to-action button under your biography? (optional)
      button:
        text: Download CV
        url: uploads/resume.pdf
    design:
      css_class: dark
      # Avatar customization
      avatar:
        size: medium  # Options: small (150px), medium (200px, default), large (320px), xl (400px), xxl (500px)
        shape: circle # Options: circle (default), square, rounded
      background:
        # Navy gradient (to use a photo instead, add `image: filename: ...` from `assets/media/`)
        color: '#0b1224'
        gradient_start: '#0b1224'
        gradient_end: '#1e3a5f'
        gradient_angle: 135
  - block: markdown
    content:
      title: '📚 My Research'
      subtitle: ''
      text: |-
        I work on the **security of AI systems** and on **AI for cyber defence**: AI security plans and controls,
        shadow-AI detection, prompt-injection testing and guardrail evaluation, and agentic AI threat modelling.

        Alongside this I work on **vulnerability intelligence**, and my academic
        background is in machine learning and multi-objective (skyline / Pareto) optimisation over big data.

        Working on AI security, LLM red-teaming or vulnerability intelligence? I'm always glad to compare notes,
        review ideas or collaborate on research. Say hello at [christos@christoskalyvas.eu](mailto:christos@christoskalyvas.eu).
    design:
      columns: '1'
  - block: markdown
    id: focus
    content:
      title: 'Focus Areas'
      subtitle: ''
      text: |-
        | Area | What I work on |
        |---|---|
        | **Security of AI** | AI security strategy and control design · prompt-injection and guardrail evaluation · agentic AI threat modelling · AI asset visibility and unsanctioned (shadow) AI detection |
        | **AI for security** | Agentic workflows for security operations · ML detection engineering · AI-assisted code review and penetration-test reporting |
        | **Vulnerability & threat intelligence** | Exploitation forecasting (KEV / EPSS) · advisory standards (CSAF) · CTI fusion with geopolitical and narrative signals |
        | **Decision intelligence** | Multi-objective (Pareto / skyline) methods for ranking risk, choosing controls and briefing leadership under uncertainty |
    design:
      columns: '1'
  - block: collection
    id: papers
    content:
      title: Featured Publications
      filters:
        folders:
          - publication
        featured_only: true
    design:
      view: article-grid
      columns: 2
  - block: collection
    content:
      title: Recent Publications
      text: ""
      filters:
        folders:
          - publication
        exclude_featured: false
    design:
      view: citation
---
