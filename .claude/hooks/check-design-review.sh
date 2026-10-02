#!/usr/bin/env bash
# Blocks finishing work while design-relevant files have changed since the
# last recorded design review. Used as a Claude Code Stop hook; also callable
# directly with --record by the design-reviewer sub-agent once it approves a
# change, to mark the current state as reviewed.
#
# Design philosophy: fail OPEN. Any time we can't reliably determine the
# repo's state, we exit 0 (allow) rather than block.
set -uo pipefail

fail_open() {
	exit 0
}

REPO_ROOT=$(git rev-parse --show-toplevel 2>/dev/null) || fail_open
cd "$REPO_ROOT" || fail_open

MARKER="$REPO_ROOT/.claude/.design-review-marker"

# Keep this list in sync with the "Design review enforcement" section of AGENTS.md.
DESIGN_PATHS=(
	"src/components"
	"src/layouts"
	"src/pages"
	"src/styles"
	"src/content"
	"public/assets"
	"design-system"
)

command -v shasum >/dev/null 2>&1 || fail_open
command -v find >/dev/null 2>&1 || fail_open

existing_paths=()
for p in "${DESIGN_PATHS[@]}"; do
	if [ -e "$REPO_ROOT/$p" ]; then
		existing_paths+=("$REPO_ROOT/$p")
	fi
done

if [ "${#existing_paths[@]}" -eq 0 ]; then
	sig="none"
else
	sig=$(find "${existing_paths[@]}" -type f 2>/dev/null | LC_ALL=C sort | xargs -I{} shasum -a 256 "{}" 2>/dev/null | shasum -a 256 | awk '{print $1}')
	[ -n "$sig" ] || fail_open
fi

if [ "${1:-}" = "--record" ]; then
	mkdir -p "$(dirname "$MARKER")" || fail_open
	printf '%s\n' "$sig" >"$MARKER" || fail_open
	exit 0
fi

BLOCK_MSG="Design-relevant files (src/components, src/layouts, src/pages, src/styles, src/content, public/assets, design-system) have changed since the last recorded design review. Dispatch the design-reviewer sub-agent (.claude/agents/design-reviewer.md) to review the change against design-system/, then have it record the review (bash .claude/hooks/check-design-review.sh --record) before finishing."

if [ ! -f "$MARKER" ]; then
	if [ "$sig" = "none" ]; then
		exit 0
	fi
	echo "$BLOCK_MSG" >&2
	exit 2
fi

recorded_sig=$(cat "$MARKER" 2>/dev/null) || fail_open

if [ "$sig" = "$recorded_sig" ]; then
	exit 0
fi

echo "$BLOCK_MSG" >&2
exit 2
