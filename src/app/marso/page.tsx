import Link from "next/link";

import {
  hasMarsoPreviewRoot,
  listMarsoPreviewDatasets,
} from "@/lib/marso-preview";

export const dynamic = "force-dynamic";

export default async function MarsoPreviewPage() {
  const hasRoot = hasMarsoPreviewRoot();
  const datasets = hasRoot ? await listMarsoPreviewDatasets() : [];

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.3em] text-orange-400">
          Marso Preview
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight">
          Local dataset previews
        </h1>
        <p className="mt-3 max-w-2xl text-slate-400">
          This view reads preview metadata generated locally by
          `robot-autonomy`. It is intended for early iteration before full
          parquet-backed LeRobot datasets are emitted.
        </p>

        {!hasRoot ? (
          <div className="mt-8 rounded-xl border border-amber-500/30 bg-amber-500/10 p-5 text-sm text-amber-100">
            `MARSO_DATASET_ROOT` is not configured. Point it to a directory that
            contains dataset folders with `meta/info.json` and
            `meta/episodes/preview.json`.
          </div>
        ) : null}

        {hasRoot && datasets.length === 0 ? (
          <div className="mt-8 rounded-xl border border-slate-800 bg-slate-900 p-5 text-sm text-slate-300">
            No local preview datasets were found under `MARSO_DATASET_ROOT`.
          </div>
        ) : null}

        {datasets.length > 0 ? (
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {datasets.map((dataset) => (
              <Link
                key={dataset}
                href={`/marso/${dataset}`}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-5 transition-colors hover:border-orange-400 hover:bg-slate-900/80"
              >
                <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                  Dataset
                </p>
                <h2 className="mt-2 text-xl font-medium text-slate-100">
                  {dataset}
                </h2>
                <p className="mt-3 text-sm text-slate-400">
                  Inspect preview metadata, task labels, frame counts, and
                  episode-level timing before the full LeRobot export path is
                  finished.
                </p>
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
