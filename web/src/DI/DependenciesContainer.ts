import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';

import * as authAPI from 'src/api/AuthAPI';
import * as categoryAPI from 'src/api/CategoryAPI';
import * as featureTypeAPI from 'src/api/FeatureTypeAPI';
import * as featureValueAPI from 'src/api/FeatureValueAPI';
import * as intlAPI from 'src/api/IntlAPI';
import * as productTypeAPI from 'src/api/ProductTypeAPI';
import * as productAPI from 'src/api/ProductAPI';
import * as searchAPI from 'src/api/SearchAPI';
import * as bannerAPI from 'src/api/BannerAPI';
import * as orderAPI from 'src/api/OrderAPI';

import * as authService from 'src/services/AuthService';
import * as categoryService from 'src/services/CategoryService';
import * as featureTypeService from 'src/services/FeatureTypeService';
import * as featureValueService from 'src/services/FeatureValueService';
import * as intlService from 'src/services/IntlService';
import * as productTypeService from 'src/services/ProductTypeService';
import * as productService from 'src/services/ProductService';
import * as searchService from 'src/services/SearchService';
import * as bannerService from 'src/services/BannerService';
import * as orderService from 'src/services/OrderService';

import * as authStorage from 'src/storage/AuthStorage';
import * as intlStorage from 'src/storage/IntlStorage';
import * as stateCacheStorage from 'src/storage/StateCacheStorage';
import * as cartStorage from 'src/storage/CartStorage';

import { HeadersManager } from 'src/manager/HeadersManager';

import { WatchingValue } from 'src/utils/watching-value';

export interface IAPIsContainer {
  auth: authAPI.IAuthAPI;
  category: categoryAPI.ICategoryAPI;
  productType: productTypeAPI.IProductTypeAPI;
  product: productAPI.IProductAPI;
  featureType: featureTypeAPI.IFeatureTypeAPI;
  featureValue: featureValueAPI.IFeatureValueAPI;
  intl: intlAPI.IIntlAPI;
  search: searchAPI.ISearchAPI;
  banner: bannerAPI.IBannerAPI;
  order: orderAPI.IOrderAPI;
}

export interface IServicesContainer {
  auth: authService.IAuthService;
  category: categoryService.ICategoryService;
  productType: productTypeService.IProductTypeService;
  product: productService.IProductService;
  featureType: featureTypeService.IFeatureTypeService;
  featureValue: featureValueService.IFeatureValueService;
  intl: intlService.IIntlService;
  search: searchService.ISearchService;
  banner: bannerService.IBannerService;
  order: orderService.IOrderService;
}

export interface IStoragesContainer {
  auth: authStorage.IAuthStorage;
  intl: intlStorage.IIntlStorage;
  stateCache: stateCacheStorage.IStateCacheStorage;
  cart: cartStorage.ICartStorage;
}

export interface IDependenciesContainer {
  APIs: IAPIsContainer;
  services: IServicesContainer;
  storages: IStoragesContainer;
}

enum Status {
  Idle,
  Busy,
}

const tokensRefreshStatusWV = new WatchingValue<Status>(Status.Idle);
const makeResponseErrorInterceptor = (
  authService: authService.IAuthService,
  APIClient: AxiosInstance,
  headersManager: HeadersManager,
) => async (error: { response: AxiosResponse; config: AxiosRequestConfig }) => {
  if (error.response.status === 401) {
    if (tokensRefreshStatusWV.get() === Status.Idle) {
      try {
        tokensRefreshStatusWV.set(Status.Busy);
        await authService.refreshTokens();
        error.config.headers = { ...error.config.headers, ...headersManager.getHeaders() };
      } catch (e) {
        authService.logOut();
      } finally {
        tokensRefreshStatusWV.set(Status.Idle);
      }
    } else if (tokensRefreshStatusWV.get() === Status.Busy) {
      await tokensRefreshStatusWV.watchPromise(status => status === Status.Idle);
      error.config.headers = { ...error.config.headers, ...headersManager.getHeaders() };
    }

    return APIClient.request(error.config);
  }

  throw error;
};

class DependenciesContainer implements IDependenciesContainer {
  public APIs: IAPIsContainer;
  public services: IServicesContainer;
  public storages: IStoragesContainer;
  constructor(APIs: IAPIsContainer, storages: IStoragesContainer, services: IServicesContainer) {
    this.APIs = APIs;
    this.storages = storages;
    this.services = services;
  }
}

export const makeDependenciesContainer = (): IDependenciesContainer => {
  const storagesContainer = {
    auth: new authStorage.AuthStorage(localStorage),
    intl: new intlStorage.IntlStorage(localStorage),
    stateCache: new stateCacheStorage.StateCacheStorage(localStorage),
    cart: new cartStorage.CartStorage(localStorage),
  };

  const headersManager = new HeadersManager(storagesContainer.auth, storagesContainer.intl);
  const APIClient = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

  const APIsContainer = {
    auth: new authAPI.AuthAPI(APIClient, headersManager),
    category: new categoryAPI.CategoryAPI(APIClient, headersManager),
    featureType: new featureTypeAPI.FeatureTypeAPI(APIClient, headersManager),
    featureValue: new featureValueAPI.FeatureValueAPI(APIClient, headersManager),
    intl: new intlAPI.IntlAPI(APIClient, headersManager),
    productType: new productTypeAPI.ProductTypeAPI(APIClient, headersManager),
    product: new productAPI.ProductAPI(APIClient, headersManager),
    search: new searchAPI.SearchAPI(APIClient, headersManager),
    banner: new bannerAPI.BannerAPI(APIClient, headersManager),
    order: new orderAPI.OrderAPI(APIClient, headersManager),
  };

  const servicesContainer = {
    auth: new authService.AuthService(APIsContainer.auth, storagesContainer.auth, storagesContainer.stateCache),
    category: new categoryService.CategoryService(APIsContainer.category),
    featureType: new featureTypeService.FeatureTypeService(APIsContainer.featureType),
    featureValue: new featureValueService.FeatureValueService(APIsContainer.featureValue),
    intl: new intlService.IntlService(APIsContainer.intl, storagesContainer.intl),
    productType: new productTypeService.ProductTypeService(APIsContainer.productType),
    product: new productService.ProductService(APIsContainer.product),
    search: new searchService.SearchService(APIsContainer.search),
    banner: new bannerService.BannerService(APIsContainer.banner),
    order: new orderService.OrderService(APIsContainer.order),
  };

  APIClient.interceptors.response.use(
    undefined,
    makeResponseErrorInterceptor(servicesContainer.auth, APIClient, headersManager),
  );

  return new DependenciesContainer(APIsContainer, storagesContainer, servicesContainer);
};
