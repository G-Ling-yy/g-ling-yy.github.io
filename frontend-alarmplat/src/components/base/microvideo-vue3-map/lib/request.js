/**
 * @description
 * @author       刘晖(liuh@microvideo.cn)
 * @date         2021/11/16 11:18
 */
const requestConfig = {
    baseUrl: 'http://139.198.170.213:18099/lwdd',
    headers: {
        "Content-Type": 'application/json',
        "Accept": 'application/json',
        "token": '123'
    }
}

let fetchConfig = null;

function configureFetchConfig(config = {}) {
    fetchConfig = Object.assign(requestConfig,config);
}

class Request {

    constructor(param = {},config = {}) {
        this.params = param;
        this.config = Object.assign(fetchConfig,config);
    }

    config(key, value) {
        this.config[key] = value
        return this
    }

    add(key, value) {
        this.params[key] = value
        return this
    }

    clear () {
        this.params = {}
        return this
    }

    setParameters (parameters) {
        this.params = parameters
        return this
    }

    post(url,config) {
        return this.request(url,"POST",config);
    }

    get(url,config) {
        return this.request(url,"GET",config);
    }

    put (url, config) {
        return this.request(url, "PUT",config)
    }

    delete (url, config) {
        return this.request(url, "DELETE",config)
    }

    formData (url) {
        return this.request(url, "formData", { "Content-Type": "multipart/form-data;", })
    }

    request(url,method,configObject = {}){
        let self = this;
        return new Promise((resolve, reject) => {
            let data = {};
            url = self.config.baseUrl + url;
            if (method === 'formData'){
                self.config.method = 'POST';
                self.config.data =this.params;
            }else {
                if (self.params != undefined){
                    Object.keys(self.params).forEach(key=>{
                        let reger = new RegExp("{" + key + "}");
                        if (reger.test(url)){
                            self.config.url = url.replace(reger, self.params[key]);
                        }else {
                            data[key] = self.params[key]
                        }
                    })
                }
                this.config.data = data;
                //设置请求method
                if (method.toUpperCase() === "GET" || method.toUpperCase() === "POST" || method.toUpperCase() === "DELETE") {
                    self.config.method = method.toUpperCase()
                } else {
                    self.config.method = "POST"
                    self.config.data["_method"] = method.toUpperCase()
                }
            }

            /*if (!self.config.dataType){
                self.config.dataType = "json"
            }*/
            let requetConfig = null;
            try {
                requetConfig = Object.assign({
                    method: self.config.method,
                    /*url: url,*/
                },self.config, configObject)
            } catch (error) {
                console.log(error)
            }

            if (self.config.method.toUpperCase() == "GET") {
                requetConfig.params = self.config.data
            } else {
                requetConfig.data = self.config.data
            }

            delete requetConfig.baseUrl;

            fetch(url,requetConfig).then(res=>res.json()).then(response=>{
                if (response.status == 0) {
                    resolve(response)
                }else {
                    reject({
                        status: response.status,
                        statusText: response.statusText,
                        data: null
                    })
                }
            }).catch(error=>{
                if (error.response) {
                    reject({
                        status: error.response.status,
                        statusText: error.response.statusText,
                        data: error.response.data
                    })
                } else if (error.request) {
                    reject({
                        status: -1,
                        statusText: "no response",
                        data: null
                    })
                } else {
                    reject({
                        status: -2,
                        statusText: error.message,
                        data: null
                    })
                }
            })
        });
    }

}

function createRequest(obj) {
    return new Request(obj)
}

export {createRequest,configureFetchConfig}
