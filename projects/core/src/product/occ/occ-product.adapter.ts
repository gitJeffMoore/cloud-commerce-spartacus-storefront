import { Injectable } from '@angular/core';
import { ProductAdapter } from '../connectors/product/product.adapter';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { OccEndpointsService } from '../../occ/services/occ-endpoints.service';
import { ConverterService } from '../../util/converter.service';
import { PRODUCT_NORMALIZER } from '../connectors/product/converters';
import { UIProduct } from '../model/product';

@Injectable()
export class OccProductAdapter implements ProductAdapter {
  constructor(
    private http: HttpClient,
    private occEndpoints: OccEndpointsService,
    protected converter: ConverterService
  ) {}

  load(productCode: string): Observable<UIProduct> {
    return this.http
      .get(this.getEndpoint(productCode))
      .pipe(this.converter.pipeable(PRODUCT_NORMALIZER));
  }

  protected getEndpoint(code: string): string {
    return this.occEndpoints.getUrl('product', {
      productCode: code,
    });
  }
}
