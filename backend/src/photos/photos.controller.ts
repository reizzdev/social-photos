import {Body, Controller, Get, Post, UseGuards, Req, Param, Delete, Patch} from '@nestjs/common';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateDto } from './dto/create.dto';

@Controller('photos')
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() body: CreateDto, 
    @Req() req: any) {
    return this.photosService.createPhoto(req.user.userId, body);
  }

  @Get()
  findAll() {
    return this.photosService.findAll();
  }

  @Get('user/:id')
  findByUser(
    @Param('id') id: string) {
    return this.photosService.findByUser(id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(
    @Param('id') id: string, 
    @Req() req: any) {
    return this.photosService.delete(req.user.userId, id);
  }

  @Patch('censor/:id')
  async toggleCensor(
    @Param('id') id: string) {
    return this.photosService.toggleCensor(id);
  }

  @Get('tag/:name')
  async getPhotosByTag(
    @Param('name') name: string) {
    return this.photosService.getByTag(name);
  }

  @UseGuards(JwtAuthGuard)
  @Post('like/:photoId')
  async toggleLike(
    @Param('photoId') photoId: string, 
    @Req() req) {
    const userId = req.user.userId;

    return this.photosService.toggleLike(photoId, userId);
  }
}
