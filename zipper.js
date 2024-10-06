import archiver from 'archiver';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/**
 * 指定したディレクトリをZIPファイルに圧縮する関数
 * @param sourceDir 圧縮したいディレクトリのパス
 * @param outPath 出力するZIPファイルのパス
 */
function zipDirectory(sourceDir, outPath) {

    const output = fs.createWriteStream(outPath);
    const archive = archiver('zip', {
        zlib: { level: 9 } // 圧縮レベルを指定 (0-9)
    });

    output.on('close', () => {
        console.log(`${archive.pointer()} total bytes`);
        console.log('ZIPファイルの作成が完了しました。');
    });

    archive.on('error', (err) => {
        throw err;
    });

    archive.pipe(output);
    archive.directory(sourceDir, false, {
        ignore: (filePath) => {
            return path.basename(filePath) === outputZipName;
        }
    });
    archive.finalize();
}

const directoryToZip = path.join(__dirname, 'dist');
const outputZipPath = path.join(__dirname, 'product.zip');

zipDirectory(directoryToZip, outputZipPath);
