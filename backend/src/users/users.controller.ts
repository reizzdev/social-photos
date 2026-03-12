import { Body, Controller, Get, Post, Delete, Param, Req, UseGuards, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(
    @Req() req: any) {
    // req.user.userId viene de JwtStrategy, ya es UUID válido
    return this.usersService.getProfile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('follow/:id')
  follow(
    @Req() req: any, 
    @Param('id') targetId: string) {
    return this.usersService.follow(req.user.userId, targetId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('unfollow/:id')
  unfollow(
    @Req() req: any, 
    @Param('id') targetId: string) {
    return this.usersService.unfollow(req.user.userId, targetId);
  }

  @Get('followers/:id')
  getFollowers(
    @Param('id') userId: string) {
    return this.usersService.getFollowers(userId);
  }

  @Get('following/:id')
  getFollowing(
    @Param('id') userId: string) {
    return this.usersService.getFollowing(userId);
  }

  @Get(':id')
  getUserById(
    @Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Get("username/:username")
async getByUsername(
  @Param("username") username: string) {
  return this.usersService.findByUsername(username);
}

@UseGuards(JwtAuthGuard)
@Patch('avatar')
updateAvatar(@Req() req: any, @Body() body: { avatar_url: string }) {
  return this.usersService.updateAvatar(req.user.userId, body.avatar_url);
}
}