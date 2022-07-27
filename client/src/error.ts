export type IError = {
    error: string
}

export function returnError(err: any): IError{
    let msg: string;
    if(err instanceof Error) msg = err.message;
    else msg = String(err);
    return {error: msg};
}
