import { NextFunction, Request, Response } from 'express';

/**
 * Middleware de gestion globale des erreurs
 *
 * @param err - L'erreur Express (peut être la notre ou une autre)
 * @param req - La requête initiale
 * @param res - L'objet de réponse
 * @param next - Permet de passer au middleware suivant si existant
 *
 * @see https://expressjs.com/en/guide/error-handling.html
 */
export const ExceptionsHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err)
  }

  if (err.status && err.error) {
    return res
      .status(err.status)
      .json({ error: err.error })
  }

  return res
    .status(500)
    .json({ error: 'Internal server error' })
}
