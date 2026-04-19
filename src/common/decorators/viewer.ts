import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/db/prisma/client/client';

export const ViewerAuth = () =>
  SetMetadata('roles', [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER]);
