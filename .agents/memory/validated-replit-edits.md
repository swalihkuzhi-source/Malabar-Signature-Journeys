---
name: Validated Replit config edits
description: Preserve project settings when applying schema-validated .replit updates.
---

The schema-validated `.replit` replacement helper uses the temporary file as a full replacement; it does not merge settings into the existing file.

**Why:** A partial replacement removed deployment, workflow, and post-merge settings before the original configuration was restored.

**How to apply:** Copy the complete current `.replit` content into the temporary file, change only the requested settings, validate the replacement, then verify the resulting diff.
