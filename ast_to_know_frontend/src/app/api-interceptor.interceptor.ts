import {HttpInterceptorFn} from '@angular/common/http';

export const apiInterceptorInterceptor: HttpInterceptorFn = (req, next) => {
    const full_url = `http://127.0.0.1:8000/${req.url}`

    if (localStorage.getItem('token')) {
        const authReq = req.clone({
            setHeaders: {Authorization: `Bearer ${localStorage.getItem('token')}`},
            url: full_url
        });
        return next(authReq);
    } else {
        const authReq = req.clone({url: full_url})
        return next(authReq)
    }
};
