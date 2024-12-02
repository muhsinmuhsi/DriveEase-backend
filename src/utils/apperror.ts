export class apperror extends Error{
    statuscode: number
    status: string
    constructor(messege:string,statuscode:number){
        super(messege)
        this.statuscode=statuscode
        this.status=`${statuscode}`.startsWith('4')?"fail":"error"
        Error.captureStackTrace(this,this.constructor)
    }
    
}

