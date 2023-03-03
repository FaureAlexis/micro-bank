import { ApiException } from '../../types/exceptions';

class Exception implements ApiException {
  constructor(readonly error: any, readonly status: number) {}
}

/**
 * Création d'une 404
 */
export class NotFoundException extends Exception {
  constructor(error: any) {
    super(error, 404);
  }
}

/**
 * Création d'une 400
 */
export class BadRequestException extends Exception {
  constructor(error: any) {
    super(error, 400);
  }
}

/**
 * Création d'une 401
 */

export class UnauthorizedException extends Exception {
  constructor(error: any) {
    super(error, 401);
  }
}
