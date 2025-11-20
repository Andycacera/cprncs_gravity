import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';

@Injectable()
export class JsonDbService {
  private readonly dataDir = path.resolve(process.cwd(), 'data');

  private getFilePath(collection: string): string {
    return path.join(this.dataDir, `${collection}.json`);
  }

  private async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (e) {
      void e;
    }
  }

  async readCollection<T = any>(collection: string): Promise<T[]> {
    await this.ensureDataDir();
    const file = this.getFilePath(collection);

    try {
      const content = await fs.readFile(file, 'utf8');
      if (!content.trim()) return [];
      return JSON.parse(content) as T[];
    } catch (err) {
      const errObj: { code: string } = err as { code: string };
      if (errObj.code === 'ENOENT') {
        return [];
      }
      throw err;
    }
  }

  async writeCollection<T = any>(collection: string, data: T[]): Promise<void> {
    await this.ensureDataDir();
    const file = this.getFilePath(collection);
    await fs.writeFile(file, JSON.stringify(data, null, 2), 'utf8');
  }
}
