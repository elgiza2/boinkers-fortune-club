<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Merge Island rules live in a pure, tested module separate from artwork and the upgrade view, so purchases and merges share one source of truth.
- Bank elapsed SOLO at the old board rate before board changes; retain fractional production to avoid losing earnings.
- Game state uses the existing device-local provider until account persistence is requested; connected Cloud resources remain unused.
- Render drag overlays in a body portal, outside frosted-glass ancestors, so backdrop filters cannot offset drag collision coordinates.
- Wheel rewards and landing angles share a pure tested module so displayed segments match awarded prizes.
- Screen supports opting out of bottom navigation for standalone experiences while preserving shared top balances.
- NFT sales use browser-only TON Connect loaded on demand; never submit payment without verified NFT sale listings and configured prices, and never treat a transfer as proof of NFT ownership.
