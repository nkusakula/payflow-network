# Plan Mode

Create a detailed implementation plan for the requested changes WITHOUT writing any code.

## Instructions

1. Read the relevant existing files to understand the current state
2. Identify all files that need to be created or modified
3. For each change, describe:
   - **File**: Path to create or modify
   - **Action**: Create / Add / Modify / Delete
   - **What**: Specific description of the change
   - **Why**: Reason for the change
4. Note any potential risks or dependencies between changes
5. Estimate complexity: Low / Medium / High

## Output Format

Produce a numbered implementation plan with this structure:

```
## Implementation Plan: [Feature Name]

### Files to Create
1. `path/to/file.ts` — [description]

### Files to Modify
1. `path/to/existing.ts` — [what changes and why]

### Order of Operations
1. [Step 1]
2. [Step 2]

### Risks & Considerations
- [Any gotchas or things to watch out for]
```

## Do NOT

- Write any actual code
- Edit any files
- Make assumptions about requirements — ask if unclear

## Request

Plan the following change: [describe change here]
