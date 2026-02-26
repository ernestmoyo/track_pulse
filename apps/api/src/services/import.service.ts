import { parse } from 'csv-parse/sync';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../server';
import { AppError } from '../utils/errors';

interface ImportResult {
  totalRows: number;
  imported: number;
  skipped: number;
  errors: string[];
}

interface RawRow {
  respondent_id?: string;
  sex?: string;
  age_group?: string;
  sec?: string;
  district?: string;
  [key: string]: string | undefined;
}

export async function importWaveData(waveId: string, filePath: string): Promise<ImportResult> {
  const ext = path.extname(filePath).toLowerCase();
  let rows: RawRow[];

  if (ext === '.csv') {
    const content = fs.readFileSync(filePath, 'utf-8');
    rows = parse(content, { columns: true, skip_empty_lines: true, trim: true });
  } else if (ext === '.xlsx' || ext === '.xls') {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    rows = XLSX.utils.sheet_to_json<RawRow>(workbook.Sheets[sheetName]);
  } else {
    throw new AppError(400, 'UNSUPPORTED_FORMAT', 'Only CSV and Excel files are supported');
  }

  const result: ImportResult = {
    totalRows: rows.length,
    imported: 0,
    skipped: 0,
    errors: [],
  };

  const wave = await prisma.wave.findUnique({ where: { id: waveId } });
  if (!wave) {
    throw new AppError(404, 'NOT_FOUND', 'Wave not found');
  }

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    try {
      await prisma.respondent.create({
        data: {
          waveId,
          externalId: row.respondent_id || `R${i + 1}`,
          sex: row.sex || null,
          ageGroup: row.age_group || null,
          sec: row.sec || null,
          district: row.district || null,
          completedAt: new Date(),
        },
      });
      result.imported++;
    } catch (error) {
      result.skipped++;
      result.errors.push(`Row ${i + 1}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update actual N count
  const count = await prisma.respondent.count({ where: { waveId } });
  await prisma.wave.update({
    where: { id: waveId },
    data: { actualN: count },
  });

  // Clean up file
  fs.unlinkSync(filePath);

  return result;
}
