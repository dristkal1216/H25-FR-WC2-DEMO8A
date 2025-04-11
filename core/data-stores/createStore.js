import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Crée un magasin de fichiers JSON avec des fonctions d'aide cohérentes pour la lecture et l'écriture.
 * @param {string} relativePath - Chemin relatif vers le fichier JSON.
 * @returns {Object} - Un objet contenant les propriétés de lecture, d'écriture et le chemin du fichier.
*/
export default function createStore(relativePath) {
  const fullPath = join(__dirname, '../../data', relativePath);
  const read = async () => {
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  };

  const write = async (data) => {
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2));
  };

  return { read, write, path: fullPath };
}