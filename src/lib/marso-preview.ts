import { promises as fs } from "fs";
import path from "path";

type PreviewEpisode = {
  episode_index: number;
  tasks?: string[];
  length?: number;
  [key: string]: unknown;
};

export type MarsoPreviewDataset = {
  slug: string;
  info: Record<string, unknown>;
  episodes: PreviewEpisode[];
};

function getPreviewRoot(): string | null {
  const value = process.env.MARSO_DATASET_ROOT?.trim();
  return value ? value : null;
}

export function hasMarsoPreviewRoot(): boolean {
  return getPreviewRoot() !== null;
}

export async function listMarsoPreviewDatasets(): Promise<string[]> {
  const root = getPreviewRoot();
  if (!root) {
    return [];
  }

  const entries = await fs.readdir(root, { withFileTypes: true });
  const datasets: string[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const infoPath = path.join(root, entry.name, "meta", "info.json");
    const previewPath = path.join(
      root,
      entry.name,
      "meta",
      "episodes",
      "preview.json",
    );
    if (await exists(infoPath) && await exists(previewPath)) {
      datasets.push(entry.name);
    }
  }

  return datasets.sort();
}

export async function loadMarsoPreviewDataset(
  slug: string,
): Promise<MarsoPreviewDataset | null> {
  const root = getPreviewRoot();
  if (!root) {
    return null;
  }

  const datasetRoot = path.join(root, slug);
  const infoPath = path.join(datasetRoot, "meta", "info.json");
  const previewPath = path.join(datasetRoot, "meta", "episodes", "preview.json");

  if (!(await exists(infoPath)) || !(await exists(previewPath))) {
    return null;
  }

  const info = JSON.parse(await fs.readFile(infoPath, "utf-8")) as Record<
    string,
    unknown
  >;
  const preview = JSON.parse(await fs.readFile(previewPath, "utf-8")) as {
    episodes?: PreviewEpisode[];
  };

  return {
    slug,
    info,
    episodes: Array.isArray(preview.episodes) ? preview.episodes : [],
  };
}

async function exists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}
