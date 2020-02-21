import axios from 'axios';

import * as authAPI from 'src/api/AuthAPI';
import * as categoryAPI from 'src/api/CategoryAPI';
import * as featureTypeAPI from 'src/api/FeatureTypeAPI';
import * as featureValueAPI from 'src/api/FeatureValueAPI';
import * as intlAPI from 'src/api/IntlAPI';
import * as productTypeAPI from 'src/api/ProductTypeAPI';
import * as productAPI from 'src/api/ProductAPI';
import * as searchAPI from 'src/api/SearchAPI';

import * as authService from 'src/services/AuthService';
import * as categoryService from 'src/services/CategoryService';
import * as featureTypeService from 'src/services/FeatureTypeService';
import * as featureValueService from 'src/services/FeatureValueService';
import * as intlService from 'src/services/IntlService';
import * as productTypeService from 'src/services/ProductTypeService';
import * as productService from 'src/services/ProductService';
import * as searchService from 'src/services/SearchService';

import * as authStorage from 'src/storage/AuthStorage';
import * as intlStorage from 'src/storage/IntlStorage';

import { HeadersManager } from 'src/manager/HeadersManager';

export interface IAPIsContainer {
  auth: authAPI.IAuthAPI;
  category: categoryAPI.ICategoryAPI;
  productType: productTypeAPI.IProductTypeAPI;
  product: productAPI.IProductAPI;
  featureType: featureTypeAPI.IFeatureTypeAPI;
  featureValue: featureValueAPI.IFeatureValueAPI;
  intl: intlAPI.IIntlAPI;
  search: searchAPI.ISearchAPI;
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
}

export interface IStoragesContainer {
  auth: authStorage.IAuthStorage;
  intl: intlStorage.IIntlStorage;
}

export interface IDependenciesContainer {
  APIs: IAPIsContainer;
  services: IServicesContainer;
  storages: IStoragesContainer;
}

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
  };

  const headersManager = new HeadersManager(storagesContainer.auth, storagesContainer.intl);
  const APIClient = axios.create({ baseURL: process.env.REACT_SERVER_URL });
  const APIsContainer = {
    auth: new authAPI.AuthAPI(APIClient),
    category: new categoryAPI.CategoryAPI(APIClient, headersManager),
    featureType: new featureTypeAPI.FeatureTypeAPI(APIClient, headersManager),
    featureValue: new featureValueAPI.FeatureValueAPI(APIClient, headersManager),
    intl: new intlAPI.IntlAPI(APIClient, headersManager),
    productType: new productTypeAPI.ProductTypeAPI(APIClient, headersManager),
    product: new productAPI.ProductAPI(APIClient, headersManager),
    search: new searchAPI.SearchAPI(APIClient, headersManager),
  };

  const servicesContainer = {
    auth: new authService.AuthService(APIsContainer.auth, storagesContainer.auth),
    category: new categoryService.CategoryService(APIsContainer.category),
    featureType: new featureTypeService.FeatureTypeService(APIsContainer.featureType),
    featureValue: new featureValueService.FeatureValueService(APIsContainer.featureValue),
    intl: new intlService.IntlService(APIsContainer.intl, storagesContainer.intl),
    productType: new productTypeService.ProductTypeService(APIsContainer.productType),
    product: new productService.ProductService(APIsContainer.product),
    search: new searchService.SearchService(APIsContainer.search),
  };

  return new DependenciesContainer(APIsContainer, storagesContainer, servicesContainer);
};
