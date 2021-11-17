import { ImagePool } from '@squoosh/lib';
import { cpus } from 'os';
import path from 'path';
import fs from 'fs/promises';

const makeOutputDirectory = async (path) => {
    try {
        await fs.mkdir(path + 'output');
    } catch (e) {
        console.error('ERROR MAKING OUTPUT DIRECTORY:', e);
    }
};

const getConsistentFilePath = (filepath) => filepath.charAt(filepath.length) === '/' ? filepath : (filepath + '/');

const getFilesInDirectory = async (path) => {
    try {
        const files = await fs.readdir(path);
        return files;
    } catch (e) {
        console.error('ERROR READING FILES IN DIR', `${path}:`, e);
        return [];
    }
};

const compress = async (filepath, filename) => {
    try {
        const availableCores = cpus().length;
        const imagePool = new ImagePool((availableCores / 2) || 1);

        const file  = await fs.readFile(filepath + filename);
        
        const image = imagePool.ingestImage(file);
        await image.decoded; //Wait until the image is decoded before running preprocessors.

        const preprocessOptions = {
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
        };
        await image.encode(encodeOptions);

        const rawEncodedImage = (await image.encodedWith.mozjpeg).binary;

        await fs.writeFile(filepath + 'output/' + filename, rawEncodedImage);
        
        await imagePool.close();

        console.log('COMPRESSED IMAGE:', filename);
    } catch (e) {
        console.error('ERROR COMPRESSING IMAGE:', filename, e);
    }
};

const compressImages = async (filepath) => {
    try {
        const allowedFileExts = {
            '.JPEG': true,
            '.JPG': true,
            '.PNG': true,
        };
        const files = await getFilesInDirectory(filepath);
        const allowedFiles = files.filter((file) => (path.extname(file).toUpperCase() in allowedFileExts));
    
        const consistentPath = getConsistentFilePath(filepath);
        if (allowedFiles.length) {
            await makeOutputDirectory(consistentPath);
        }

        for (const filename of allowedFiles) {
            await compress(consistentPath, filename);
        }
    } catch (e) {
        console.error(e);
    }
}

const inputPath = process.argv[2] || process.argv[1];
compressImages(inputPath);
// (async () => {
// })()
