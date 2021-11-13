import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';

const compressImages = (path) => {
    const availableCores = cpus().length;
    console.log(path, availableCores);
    const imagePool = new ImagePool((availableCores) || 1);

    await imagePool.close();
}

(async () => {
    const path = process.argv[2];
    compressImages(path);
})()
