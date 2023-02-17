const axios = require('axios').default;

class API{

  private baseUrl: string = 'http://192.168.88.19:3333/api';

  public async get(url: string, authorization?: string) {
    try {
      const request = {
        url: `${this.baseUrl}/${url}`,
        method: 'GET',
        headers: {
          'Authorization': authorization,
          'Accept': 'application/json',
        },
      };

      const response = await axios(request);
      
      return response.data;
        
    } catch (error) {
      return error;
    }
      
  }

  public async send(url: string, data: Object, method: string = 'POST', authorization?: string, contentType: string = 'application/json') {

    try {
      const request = {
        url: `${this.baseUrl}/${url}`,
        method: method,
        headers: {
          'Authorization': authorization,
          'Content-Type': contentType,
          'Accept': 'application/json'
            
        },
        data: data,
      };

      const response = await axios(request);

      return response.data;

    } catch (error) {
      return error;
    }
      
  }

}

export default API;