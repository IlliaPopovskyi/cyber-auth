import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string | undefined = process.env.NODE_ENV;
  const filename: string = env ? `.env.${env}` : '.env.development';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    let fallback: string = resolve(`${dest}/.env.local`);
    if (!existsSync(fallback)) {
      fallback = `${dest}/.env`;
    }
    filePath = fallback;
  }

  return filePath;
}
