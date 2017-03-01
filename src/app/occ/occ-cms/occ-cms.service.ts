import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { StubService } from './stub.service';

// import { ConfigService } from '../settings/settings.service';
const BASE_URL = 'https://localhost:9002/ypscmsapi/';

@Injectable()
export class OccCmsService {

    private cmsEndpoint = 'cms/';

    constructor(
        private http: Http,
        private stub: StubService
        // private configService: ConfigService
        ) { }

    // provides a standardized endpoint ULR creation for all occ-cms related calls 
    private createEndPoint(endpoint: string) {
        console.warn('TODO: create endpoint', this.cmsEndpoint + endpoint);
        return BASE_URL + this.cmsEndpoint + endpoint;
        // return this.configService.getBaseOccUrl() + this.cmsEndpoint + endpoint;
    }

    loadComponentsForIndex() {
        return this.createHttpPromise('index/components');
    }

    loadComponentsForPage(page: string, isTemplate?: boolean) {
        let url = 'page/' + page;
        url += isTemplate ? '/templates' : '';
        url += '/components';
        return this.createHttpPromise(url);
    }

    loadComponentsForCategory(categoryCode: string, isTemplate?: boolean) {
        let url = 'category/' + categoryCode;
        url += isTemplate ? '/templates' : '';
        url += '/components';
        return this.createHttpPromise(url);
    }

    loadComponentsForProduct(categoryCode: string, isTemplate?: boolean) {
        let url = 'product/' + categoryCode;
        url += isTemplate ? '/templates' : '';
        url += '/components';
        return this.createHttpPromise(url);
    }


    private createHttpPromise(urlPart: string): Promise<any> {

        return new Promise((resolve) => {
            // stub?
            if (this.stub.hasData(urlPart)) {
                resolve(this.stub.getData(urlPart));
            }else {
                const url = this.createEndPoint(urlPart);
                 this.http.get(url).subscribe((data) => {
                    const occData = data.json();
                    resolve(occData);
                },
                err => this.logError(err));
            }

        });
    }

    private logError(err) {
        console.error('There was an error: ' + err);
    }

}
