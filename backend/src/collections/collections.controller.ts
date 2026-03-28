import {
  Body,
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { CollectionsService } from './collections.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt.guard';

@Controller('collections')
export class CollectionsController {
  constructor(private collectionsService: CollectionsService) {}

@UseGuards(OptionalJwtAuthGuard)
@Get()
findAll(@Req() req: any) {
  const requesterId = req.user?.userId;
  return this.collectionsService.findAll(requesterId);
}

  @UseGuards(OptionalJwtAuthGuard)
  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @Req() req: any) {
    const requesterId = req.user?.userId;
    return this.collectionsService.findByUser(userId, requesterId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.collectionsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: any, @Req() req: any) {
    return this.collectionsService.create(req.user.userId, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @Req() req: any) {
    return this.collectionsService.delete(req.user.userId, id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/privacy')
  togglePrivacy(@Param('id') id: string, @Req() req: any) {
    return this.collectionsService.togglePrivacy(req.user.userId, id);
  }
}
