# Saturno Hermes local optimization

Purpose: keep Hermes lean for this project.

Active project: Saturno Enneagram website.
Primary context file read by Hermes from repo: `../AGENTS.md`.

Lean default tool posture:
- Keep: terminal, file, code_execution, web, skills, todo, memory, session_search, clarify, delegation.
- Disabled globally for CLI until needed: browser, vision, image_gen, tts, messaging, cronjob, computer_use, moa.
- MCP kept: morph-mcp only, for codebase search/edit.
- MCP removed as unrelated to Saturno web work: hf-mcp, gladekit-unity, peerlm, supabase, github-mcp.

Context settings changed in `~/.hermes/config.yaml`:
- display.personality=concise
- display.compact=true
- display.resume_display=compact
- display.resume_exchanges=3
- agent.max_turns=60
- agent.reasoning_effort=low
- compression.threshold=0.45
- compression.target_ratio=0.15
- compression.protect_last_n=12
- memory.memory_char_limit=900
- memory.user_char_limit=900
- delegation.inherit_mcp_toolsets=false

Restore backup:
- Config backup is under `~/.hermes/backups/config.before-saturno-opt-*.yaml`.
- To restore: copy backup back to `~/.hermes/config.yaml`, then restart Hermes.

Re-enable when needed:
```bash
hermes tools enable browser vision image_gen tts messaging cronjob computer_use moa
hermes mcp install hf-mcp        # if HF work returns
hermes mcp install peerlm        # if eval suites return
hermes mcp add supabase --url http://127.0.0.1:16434/api/mcp
```

Note: tool/config changes apply next Hermes session or `/reset`.
