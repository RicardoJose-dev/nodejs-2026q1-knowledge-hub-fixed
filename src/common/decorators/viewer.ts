import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/db/prisma/client/client';

export const ViewerAuth = () =>
  SetMetadata('roles', [UserRole.admin, UserRole.editor, UserRole.viewer]);
