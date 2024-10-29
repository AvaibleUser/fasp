import { SetMetadata } from '@nestjs/common';

export const ADMIN = 'admin';

export const Admin = () => SetMetadata(ADMIN, true);
