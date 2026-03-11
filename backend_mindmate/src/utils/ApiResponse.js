class APIResponse{

    constructor(statusCode,message = "Success",data){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode<400

       
        if (!this.success) {
            this.error = error || message;
        }
    }
}
export {APIResponse}