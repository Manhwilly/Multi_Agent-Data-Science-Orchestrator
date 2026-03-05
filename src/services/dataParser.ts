import Papa from "papaparse";

export async function parseFileSample(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (file.name.endsWith(".csv")) {
      Papa.parse(file, {
        header: true,
        preview: 5,
        complete: (results) =>
          resolve(
            `--- File: ${file.name} ---\n${JSON.stringify(results.data, null, 2)}`,
          ),
        error: () => resolve(`--- File: ${file.name} ---\n(Error parsing CSV)`),
      });
    } else if (file.name.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target?.result as string);
          const sample = Array.isArray(json) ? json.slice(0, 5) : json;
          resolve(
            `--- File: ${file.name} ---\n${JSON.stringify(sample, null, 2)}`,
          );
        } catch {
          resolve(`--- File: ${file.name} ---\n(Invalid JSON)`);
        }
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        resolve(`--- File: ${file.name} ---\n${text.substring(0, 500)}...`);
      };
      reader.readAsText(file);
    }
  });
}

export async function generateCombinedSample(
  files: File[],
  databases: any[],
): Promise<string> {
  let sample = "";

  if (databases.length > 0) {
    sample += "--- Connected Databases ---\n";
    databases.forEach((db) => {
      sample += `DB: ${db.name} (${db.type}) - Host: ${db.host}\n`;
    });
    sample += "\n";
  }

  if (files.length > 0) {
    const fileSamples = await Promise.all(files.map((f) => parseFileSample(f)));
    sample += fileSamples.join("\n\n");
  }

  if (!sample) {
    return "No datasets or databases provided.";
  }

  return sample;
}
