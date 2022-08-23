import {Response, Request, NextFunction} from 'express';

function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if(err.name === 'UnauthorizedError') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    if(err.name === 'ValidationError') {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.status(500).json(err)
}
export default errorHandler