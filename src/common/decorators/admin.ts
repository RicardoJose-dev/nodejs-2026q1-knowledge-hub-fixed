import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/db/prisma/client/client';

export const AdminAuth = () => SetMetadata('roles', [UserRole.ADMIN]);
