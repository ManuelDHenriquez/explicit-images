import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';


@Controller('files')
export class ImagesController {

  constructor(private readonly imagesService: ImagesService) { }


  @Post('analizar-imagen')
  @UseInterceptors(FileInterceptor('file'))
  async analizarImagen(@UploadedFile() file) {
    const resultado = await this.imagesService.detectarContenidoDelicado(file);
    return { resultado };
  }


}
