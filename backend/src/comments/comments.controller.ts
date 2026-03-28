import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get('photo/:photoId')
  getByPhoto(@Param('photoId') photoId: string) {
    return this.commentsService.getByPhoto(photoId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('photo/:photoId')
  create(
    @Param('photoId') photoId: string,
    @Body() body: { content: string },
    @Req() req: any,
  ) {
    return this.commentsService.create(req.user.userId, photoId, body.content);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.commentsService.delete(req.user.userId, id);
  }
}
