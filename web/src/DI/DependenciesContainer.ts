import axios from "axios";
import * as intlService from "src/services/IntlService";
import * as authAPI from "../api/AuthAPI";
import * as authService from "../services/AuthService";
import * as authStorage from "../storage/AuthStorage";
import * as intlStorage from "../storage/IntlStorage";

export interface IAPIsContainer {
  auth: authAPI.IAuthAPI;
}

export interface IServicesContainer {
  auth: authService.IAuthService;
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
  const APIClient = axios.create({});

  const APIsContainer = {
    auth: new authAPI.AuthAPI(APIClient)
  };

  const storagesContainer = {
    auth: new authStorage.AuthStorage(localStorage),
    intl: new intlStorage.IntlStorage(localStorage)
  };

  const servicesContainer = {
    auth: new authService.AuthService(
      APIsContainer.auth,
      storagesContainer.auth
    ),
    intl: new intlService.IntlService(storagesContainer.intl)
  };

  return new DependenciesContainer(
    APIsContainer,
    storagesContainer,
    servicesContainer
  );
};
