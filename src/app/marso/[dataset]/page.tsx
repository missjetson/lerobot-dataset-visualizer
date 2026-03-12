import Link from "next/link";
import { notFound } from "next/navigation";

import { loadMarsoPreviewDataset } from "@/lib/marso-preview";

export const dynamic = "force-dynamic";

function formatTasks(value: unknown): string {
  if (!Array.isArray(value) || value.length === 0) {
    return "none";
  }
  return value.join(", ");
}

export default async function MarsoPreviewDatasetPage({
  params,
}: {
  params: Promise<{ dataset: string }>;
}) {
  const { dataset } = await params;
  const preview = await loadMarsoPreviewDataset(dataset);

  if (!preview) {
    notFound();
  }

  const robotType =
    typeof preview.info.robot_type === "string" ? preview.info.robot_type : "n/a";
  const fps = typeof preview.info.fps === "number" ? preview.info.fps : "n/a";
  const totalEpisodes = preview.episodes.length;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/marso"
          className="text-sm text-orange-400 transition-colors hover:text-orange-300"
        >
          Back to Marso previews
        </Link>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            Dataset
          </p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">
            {preview.slug}
          </h1>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Metric label="Robot type" value={String(robotType)} />
            <Metric label="FPS" value={String(fps)} />
            <Metric label="Preview episodes" value={String(totalEpisodes)} />
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xl font-medium">Preview episodes</h2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 bg-slate-900 text-sm">
              <thead className="bg-slate-900/80 text-slate-400">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Episode</th>
                  <th className="px-4 py-3 text-left font-medium">Tasks</th>
                  <th className="px-4 py-3 text-left font-medium">Frames</th>
                  <th className="px-4 py-3 text-left font-medium">Data file</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {preview.episodes.map((episode) => (
                  <tr key={String(episode.episode_index)}>
                    <td className="px-4 py-3 font-mono text-slate-200">
                      {String(episode.episode_index)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {formatTasks(episode.tasks)}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {String(episode.length ?? "n/a")}
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-400">
                      chunk {String(episode["data/chunk_index"] ?? "n/a")} / file{" "}
                      {String(episode["data/file_index"] ?? "n/a")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-medium text-slate-100">{value}</p>
    </div>
  );
}
