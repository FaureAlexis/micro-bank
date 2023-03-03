import { NotFoundException } from '../utils/exceptions';

export const UnknownRoutesHandler = () => {
  throw new NotFoundException(`Route not found`);
}
