import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {apiInterceptorInterceptor} from "./api-interceptor.interceptor";
import {provideQuillConfig} from 'ngx-quill/config';
import {en_US, provideNzI18n} from 'ng-zorro-antd/i18n';
import {registerLocaleData} from '@angular/common';
import en from '@angular/common/locales/en';
import {FormsModule} from '@angular/forms';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';

registerLocaleData(en);

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideClientHydration(), provideNzI18n(en_US), importProvidersFrom(FormsModule),
        provideAnimationsAsync(),
        provideQuillConfig({
            modules: {
                syntax: true
            }
        }),
        provideHttpClient(withInterceptors([apiInterceptorInterceptor]))]
    // providers: [provideRouter(routes), provideClientHydration(), provideNzI18n(en_US), importProvidersFrom(FormsModule),
    //     provideAnimationsAsync(), provideHttpClient()]
};
