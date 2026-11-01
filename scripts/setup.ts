import 'dotenv/config';
import { migrate } from './migrate';
import { seed } from './seed';

async function main() {
  await migrate();
  await seed();
  console.log('[setup] done. You can now run: npm run dev');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
