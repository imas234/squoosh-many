import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import path from 'path';
import fs from 'fs/promises';

const getFilesInDirectory = async (path) => {
    try {
        const files = await fs.readdir(path);
        return files;
    } catch (e) {
        console.error('ERROR READING FILES IN DIR', `${path}:`, e);
        return [];
    }
};

const compress = async (imagePool, filepath, filename) => {
    try {
        const file  = await fs.readFile(filepath + filename);
        
        const image = imagePool.ingestImage(file);
        await image.decoded; //Wait until the image is decoded before running preprocessors.

        const preprocessOptions = {
            //When both width and height are specified, the image resized to specified size.
            // resize: {
            //     enabled: true,
            //     width: 100,
            //     height: 50,
            // },        
            //When either width or height is specified, the image resized to specified size keeping aspect ratio.
            resize: {
                enabled: true,
                width: 1000,
            }
        };
        await image.preprocess(preprocessOptions);

        const encodeOptions = {
            mozjpeg: {
                // quality: 75,
            }, //an empty object means 'use default settings'
            // jxl: {
            //     quality: 90,
            // },
        };
        await image.encode(encodeOptions);

        const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;

        await fs.writeFile(filepath + 'output/' + filename, rawEncodedImage);
        console.log('COMPRESSED IMAGE:', filename);
    } catch (e) {
        console.error('ERROR COMPRESSING IMAGE:', filename);
    }
};

const compressImages = async (filepath) => {
    const availableCores = cpus().length;
    console.log(filepath, availableCores);

    const allowedFileExts = {
        '.JPEG': true,
        '.JPG': true,
        '.PNG': true,
    };
    const files = await getFilesInDirectory(filepath);
    const allowedFiles = files.filter((file) => (path.extname(file).toUpperCase() in allowedFileExts));
    const imagePool = new ImagePool((availableCores / 2) || 1);

    await Promise.all(
        allowedFiles.map((filename) => compress(imagePool, filepath, filename))
    );
    await imagePool.close();
}

const inputPath = process.argv[2] || process.argv[1];
compressImages(inputPath);
// (async () => {
// })()
