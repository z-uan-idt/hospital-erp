import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { RuntimeConfig } from 'nuxt/schema'
import axios from 'axios'

import * as apiConstants from '~/constants/api.constants'
import type { IResponse } from '~/types/response.types'

type IRequestResult<T = any, K = any> = Promise<AxiosResponse<IResponse<T, K>>>

export class ApiService {
  private instance: AxiosInstance
  private appCode: string | null = null
  private platform: string | null = null
  private deviceId: string | null = null
  private authToken: string | null = null
  private authPrefix: string = apiConstants.API_AUTH_TOKEN_PREFIX

  constructor(runtimeConfig: RuntimeConfig) {
    this.instance = axios.create({
      baseURL: runtimeConfig.public.apiBaseUrl,
      timeout: apiConstants.API_TIMEOUT,
      headers: {
        'Content-Type': apiConstants.API_CONTENT_TYPE_JSON,
      },
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.appCode) {
          config.headers['X-App-Code'] = this.appCode
        }

        if (this.deviceId) {
          config.headers['X-Device-Id'] = this.deviceId
        }

        if (this.platform) {
          config.headers['X-Platform'] = this.platform
        }

        if (this.authToken) {
          config.headers['Authorization'] = `${this.authPrefix} ${this.authToken}`
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const response = error.response as IResponse
        if (response && response.code === 41) {
          this.setAuthToken(null)
        }

        return Promise.reject(error)
      }
    )
  }

  setAuthToken(token: string | null): void {
    this.authToken = token
  }

  setAuthPrefix(prefix: string): void {
    this.authPrefix = prefix
  }

  setAppCode(appCode: string): void {
    this.appCode = appCode
  }

  setDeviceId(deviceId: string): void {
    this.deviceId = deviceId
  }

  setPlatform(platform: string): void {
    this.platform = platform
  }

  getAuthToken(): string | null {
    return this.authToken
  }

  getAuthPrefix(): string {
    return this.authPrefix
  }

  getAppCode(): string | null {
    return this.appCode
  }

  getDeviceId(): string | null {
    return this.deviceId
  }

  async request<T = any, K = any>(
    method: string,
    url: string,
    data?: any,
    options?: AxiosRequestConfig
  ): IRequestResult<T, K> {
    const config: AxiosRequestConfig = {
      method,
      url,
      ...options,
    }

    if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
      config.data = data
    } else if (data) {
      config.params = data
    }

    return await this.instance.request<IResponse<T, K>>(config)
  }

  async get<T = any, K = any>(url: string, params?: any, options?: AxiosRequestConfig): IRequestResult<T, K> {
    return this.request<T, K>('get', url, params, options)
  }

  async post<T = any, K = any>(url: string, data?: any, options?: AxiosRequestConfig): IRequestResult<T, K> {
    return this.request<T, K>('post', url, data, options)
  }

  async put<T = any, K = any>(url: string, data?: any, options?: AxiosRequestConfig): IRequestResult<T, K> {
    return this.request<T, K>('put', url, data, options)
  }

  async patch<T = any, K = any>(url: string, data?: any, options?: AxiosRequestConfig): IRequestResult<T, K> {
    return this.request<T, K>('patch', url, data, options)
  }

  async delete<T = any, K = any>(url: string, params?: any, options?: AxiosRequestConfig): IRequestResult<T, K> {
    return this.request<T, K>('delete', url, params, options)
  }
}
