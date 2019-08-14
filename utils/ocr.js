import Tesseract from 'tesseract.js';
import { sendOcr } from '../libs/notify';
import config from '../config/config.json';

const { TesseractWorker } = Tesseract;
const worker = new TesseractWorker();

module.exports = async image => {
  const { text } = await worker.recognize(image);
  if (text) {
    await sendOcr(config, text);
    await worker.terminate();
    return;
  }
};
