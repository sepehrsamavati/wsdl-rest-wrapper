interface ICreateInstance {
    name: string;
    token: string;
    wsdlUrl: string;
    basicAuth?: {
        username: string;
        password: string;
    };
}
