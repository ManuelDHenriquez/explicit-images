import { Injectable } from '@nestjs/common';
import * as sharp from 'sharp';
import * as tf from '@tensorflow/tfjs';
import * as nsfw from 'nsfwjs';

@Injectable()
export class ImagesService {
  async convert(img) {
    const imageBuffer = await sharp(img)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const numChannels = 3;
    const numPixels = imageBuffer.data.length / numChannels;
    const values = new Int32Array(numPixels * numChannels);

    for (let i = 0; i < numPixels; i++) {
      for (let c = 0; c < numChannels; ++c) {
        values[i * numChannels + c] = imageBuffer.data[i * numChannels + c];
      }
    }

    return tf.tensor3d(
      values,
      [imageBuffer.info.height, imageBuffer.info.width, numChannels],
      'int32',
    );
  }

  async detectarContenidoDelicado(imagen) {
    const _model = await nsfw.load();
    const image = await this.convert(imagen.buffer);
    const predictions = await _model.classify(image);
    image.dispose();
    return predictions;
  }
}
