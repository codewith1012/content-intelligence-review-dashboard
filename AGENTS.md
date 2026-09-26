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

- Frontend only: all data goes through `src/services/contentAtoms.ts` (REST to FastAPI via VITE_API_BASE_URL); no direct Supabase access — backend owns data and auth.
- Mock data lives in `src/services/mock/` and is selected automatically when VITE_API_BASE_URL is unset — keeps dev usable without a backend.
