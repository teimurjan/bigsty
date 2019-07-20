import axios from "axios";

import * as authAPI from "src/api/AuthAPI";
import * as categoryAPI from "src/api/CategoryAPI";
import * as featureTypeAPI from "src/api/FeatureTypeAPI";
import * as intlAPI from "src/api/IntlAPI";
import * as productTypeAPI from "src/api/ProductTypeAPI";

import * as authService from "src/services/AuthService";
import * as categoryService from "src/services/CategoryService";
import * as featureTypeService from "src/services/FeatureTypeService";
import * as intlService from "src/services/IntlService";
import * as productTypeService from "src/services/ProductTypeService";

import * as authStorage from "src/storage/AuthStorage";
import * as intlStorage from "src/storage/IntlStorage";

import { HeadersManager } from "src/manager/HeadersManager";

export interface IAPIsContainer {
  auth: authAPI.IAuthAPI;
  category: categoryAPI.ICategoryAPI;
  productType: productTypeAPI.IProductTypeAPI;
  featureType: featureTypeAPI.IFeatureTypeAPI;
  intl: intlAPI.IIntlAPI;
}

export interface IServicesContainer {
  auth: authService.IAuthService;
  category: categoryService.ICategoryService;
  productType: productTypeService.IProductTypeService;
  featureType: featureTypeService.IFeatureTypeService;
  intl: intlService.IIntlService;
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
  constructor(
    APIs: IAPIsContainer,
    storages: IStoragesContainer,
    services: IServicesContainer
  ) {
    this.APIs = APIs;
    this.storages = storages;
    this.services = services;
  }
}

export const makeDependenciesContainer = (): IDependenciesContainer => {
  const storagesContainer = {
    auth: new authStorage.AuthStorage(localStorage),
    intl: new intlStorage.IntlStorage(localStorage)
  };

  const headersManager = new HeadersManager(
    storagesContainer.auth,
    storagesContainer.intl
  );
  const APIClient = axios.create({});
  const APIsContainer = {
    auth: new authAPI.AuthAPI(APIClient),
    category: new categoryAPI.CategoryAPI(APIClient, headersManager),
    featureType: new featureTypeAPI.FeatureTypeAPI(APIClient, headersManager),
    intl: new intlAPI.IntlAPI(APIClient, headersManager),
    productType: new productTypeAPI.ProductTypeAPI(APIClient, headersManager)
  };

  const servicesContainer = {
    auth: new authService.AuthService(
      APIsContainer.auth,
      storagesContainer.auth
    ),
    category: new categoryService.CategoryService(APIsContainer.category),
    featureType: new featureTypeService.FeatureTypeService(
      APIsContainer.featureType
    ),
    intl: new intlService.IntlService(
      APIsContainer.intl,
      storagesContainer.intl
    ),
    productType: new productTypeService.ProductTypeService(
      APIsContainer.productType
    )
  };

  return new DependenciesContainer(
    APIsContainer,
    storagesContainer,
    servicesContainer
  );
};
