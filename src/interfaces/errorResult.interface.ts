type ErrorResultInfo = Partial<IErrorResult>;

interface IErrorResult {
    httpCode: number;
    message: string;
    version: string;
    date: Date;
    details?: any;
}
