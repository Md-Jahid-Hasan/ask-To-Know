import {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {apiInterceptorInterceptor} from "./api-interceptor.interceptor";
import {provideQuillConfig} from 'ngx-quill/config';

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes), provideClientHydration(), provideQuillConfig({
        modules: {
            syntax: true
        }
    }),
        provideHttpClient(withInterceptors([apiInterceptorInterceptor]))]
};
