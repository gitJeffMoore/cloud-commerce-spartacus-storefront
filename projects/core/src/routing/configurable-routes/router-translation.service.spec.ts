import { TestBed } from '@angular/core/testing';
import { ServerConfig } from '../../config/server-config/server-config';
import { RoutingConfigService } from './routing-config.service';
import { RouterTranslationService } from './router-translation.service';
import { Router, Routes } from '@angular/router';

class MockServerConfig {
  production = false;
}

class MockRouterConfigService {
  translations = {};
  async init(): Promise<void> {}
  getRouteTranslation() {}
}

class MockRouter {
  config: Routes;
  resetConfig(newConfig): void {
    this.config = newConfig;
  }
}

describe('RouterTranslationService', () => {
  let service: RouterTranslationService;
  let serverConfig: MockServerConfig;
  let router: Router;
  let routingConfigService: RoutingConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RouterTranslationService,
        {
          provide: RoutingConfigService,
          useClass: MockRouterConfigService,
        },
        { provide: ServerConfig, useClass: MockServerConfig },
        {
          provide: Router,
          useClass: MockRouter,
        },
      ],
    });

    service = TestBed.get(RouterTranslationService);
    serverConfig = TestBed.get(ServerConfig);
    router = TestBed.get(Router);
    routingConfigService = TestBed.get(RoutingConfigService);

    router.config = [];
  });

  describe('translateRouterConfig', () => {
    it('should load routes config from loader', async () => {
      spyOn(routingConfigService, 'init');
      await service.init();
      expect(routingConfigService.init).toHaveBeenCalled();
    });

    it('when called twice, should load routes from routes config only once', async () => {
      spyOn(routingConfigService, 'init');
      await service.init();
      await service.init();
      expect(routingConfigService.init).toHaveBeenCalledTimes(1);
    });

    it('should NOT translate "paths" of routes that are NOT configurable', async () => {
      router.config = [{ path: 'path1' }, { path: 'path2' }];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        undefined
      );
      await service.init();
      expect(router.config).toEqual([{ path: 'path1' }, { path: 'path2' }]);
    });

    it('should keep child routes for routes that are NOT configurable', async () => {
      router.config = [
        { path: 'path1' },
        { path: 'path2', children: [{ path: 'subPath' }] },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        undefined
      );
      await service.init();
      expect(router.config).toEqual([
        { path: 'path1' },
        { path: 'path2', children: [{ path: 'subPath' }] },
      ]);
    });

    it('should NOT translate "redirectTo" of routes that are NOT configurable', async () => {
      router.config = [
        { path: 'path1', redirectTo: 'path100' },
        { path: 'path2', redirectTo: 'path200' },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        undefined
      );
      await service.init();
      expect(router.config).toEqual([
        { path: 'path1', redirectTo: 'path100' },
        { path: 'path2', redirectTo: 'path200' },
      ]);
    });

    it('should translate "path" of configurable routes', async () => {
      router.config = [
        { path: null, data: { cxPath: 'page1' } },
        { path: null, data: { cxPath: 'page2' } },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        { paths: ['path1'] },
        { paths: ['path2'] }
      );
      await service.init();
      expect(router.config[0].path).toEqual('path1');
      expect(router.config[1].path).toEqual('path2');
    });

    it('should translate "redirectTo" of configurable routes', async () => {
      router.config = [
        { path: 'path1', data: { cxRedirectTo: 'page1' } },
        { path: 'path2', data: { cxRedirectTo: 'page2' } },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        { paths: ['path100'] },
        { paths: ['path200'] }
      );
      await service.init();
      expect(router.config[0].path).toEqual('path1');
      expect(router.config[0].redirectTo).toEqual('path100');
      expect(router.config[1].path).toEqual('path2');
      expect(router.config[1].redirectTo).toEqual('path200');
    });

    it('should console.warn in non-production environment if a route has configurable both "path" and "redirectTo"', async () => {
      spyOn(console, 'warn');
      serverConfig.production = false;
      router.config = [
        { path: null, data: { cxPath: 'page1', cxRedirectTo: 'page2' } },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        { paths: ['path1'] },
        { paths: ['path2'] }
      );
      await service.init();
      expect(console.warn).toHaveBeenCalled();
    });
    it('should NOT console.warn in production environment if a route has configurable both "path" and "redirectTo"', async () => {
      spyOn(console, 'warn');
      serverConfig.production = true;
      router.config = [
        { path: null, data: { cxPath: 'page1', cxRedirectTo: 'page2' } },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        { paths: ['path1'] },
        { paths: ['path2'] }
      );
      await service.init();
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should generate many routes with different paths when translations config contain many paths for a given page', async () => {
      router.config = [{ path: null, data: { cxPath: 'page1' } }];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues({
        paths: ['path1', 'path100'],
      });
      await service.init();
      expect(router.config.length).toEqual(2);
      expect(router.config[0].path).toEqual('path1');
      expect(router.config[1].path).toEqual('path100');
    });

    it('should generate route for "redirectTo" with with first configured path in translations config for a given page', async () => {
      router.config = [
        { path: 'path', redirectTo: null, data: { cxRedirectTo: 'page1' } },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues({
        paths: ['path1', 'path100'],
      });
      await service.init();
      expect(router.config.length).toEqual(1);
      expect(router.config[0].redirectTo).toEqual('path1');
    });

    it('should not generate routes if they do not have configured paths in translations config', async () => {
      router.config = [{ path: null, data: { cxPath: 'page1' } }];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(null);
      await service.init();
      expect(router.config.length).toEqual(0);
    });

    // tslint:disable-next-line:max-line-length
    it('should console.warn in non-production environment if route refers a page name that does not exist in translations config', async () => {
      spyOn(console, 'warn');
      serverConfig.production = false;
      router.config = [{ path: null, data: { cxPath: 'page1' } }];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        undefined
      );
      await service.init();
      expect(console.warn).toHaveBeenCalled();
    });

    // tslint:disable-next-line:max-line-length
    it('should NOT console.warn in production environment if route refers a page name that does not exist in translations config', async () => {
      spyOn(console, 'warn');
      serverConfig.production = true;
      router.config = [{ path: null, data: { cxPath: 'page1' } }];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        undefined
      );
      await service.init();
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should translate configurable routes placed among non-cofigurable routes', async () => {
      router.config = [
        // normal routes
        { path: 'path1' },

        // configurable routes
        { path: null, data: { cxPath: 'page2' } },

        // normal routes
        { path: 'path3', redirectTo: 'path30' },

        // configurable routes
        { path: 'path4', redirectTo: null, data: { cxRedirectTo: 'page4' } },

        // normal routes
        { path: 'path5' },
      ];
      spyOn(routingConfigService, 'getRouteTranslation').and.returnValues(
        { paths: ['path2', 'path20', 'path200'] },
        { paths: ['path40', 'path400'] }
      );
      await service.init();
      expect(router.config.length).toBe(7);
      expect(router.config).toEqual([
        // normal routes
        { path: 'path1' },

        // configurable routes
        { path: 'path2', data: { cxPath: 'page2' } },
        { path: 'path20', data: { cxPath: 'page2' } },
        { path: 'path200', data: { cxPath: 'page2' } },

        // normal routes
        { path: 'path3', redirectTo: 'path30' },

        // configurable routes
        {
          path: 'path4',
          redirectTo: 'path40',
          data: { cxRedirectTo: 'page4' },
        },

        // normal routes
        { path: 'path5' },
      ]);
    });
  });
});