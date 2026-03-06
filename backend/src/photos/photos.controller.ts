import { Body, Controller, Get, Post, UseGuards, Req, Param, Delete } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: { image_url: string; tags?: string[] },
    @Req() req: any
  ) {
    return this.photosService.createPhoto(
      req.user.userId,
      body.image_url,
      body.tags || []
    );
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get('user/:id')
  findByUser(@Param('id') id: string) {
    return this.photosService.findByUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.photosService.delete(req.user.userId, id);
  }
}